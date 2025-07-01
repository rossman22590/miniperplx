import 'server-only';

import { and, asc, desc, eq, gt, gte, inArray, lt, type SQL, notInArray, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  message,
  type Message,
  type Chat,
  stream,
  extremeSearchUsage,
  messageUsage,
  dailySearchUsage,
} from './schema';
import { ChatSDKError } from '../errors';
import { serverEnv } from '@/env/server';

type VisibilityType = 'public' | 'private';

const client = postgres(serverEnv.DATABASE_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get user by email');
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await db.insert(chat).values({
      id,
      userId,
      title,
      visibility,
    });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save chat' + error);
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(message).where(eq(message.chatId, id));
    await db.delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await db.delete(chat).where(eq(chat.id, id)).returning();
    return chatsDeleted;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to delete chat by id');
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(whereCondition ? and(whereCondition, eq(chat.userId, id)) : eq(chat.userId, id))
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await db.select().from(chat).where(eq(chat.id, startingAfter)).limit(1);

      if (!selectedChat) {
        throw new ChatSDKError('not_found:database', `Chat with id ${startingAfter} not found`);
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db.select().from(chat).where(eq(chat.id, endingBefore)).limit(1);

      if (!selectedChat) {
        throw new ChatSDKError('not_found:database', `Chat with id ${endingBefore} not found`);
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get chats by user id');
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.log('Error getting chat by id', error);
    return null;
  }
}

export async function getChatWithUserById({ id }: { id: string }) {
  try {
    const [result] = await db
      .select({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        visibility: chat.visibility,
        userId: chat.userId,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(chat)
      .innerJoin(user, eq(chat.userId, user.id))
      .where(eq(chat.id, id));
    return result;
  } catch (error) {
    console.log('Error getting chat with user by id', error);
    return null;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save messages');
  }
}

export async function getMessagesByChatId({
  id,
  limit = 50,
  offset = 0,
}: {
  id: string;
  limit?: number;
  offset?: number;
}) {
  'use cache';
  
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get messages by chat id');
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get message by id');
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({ chatId, timestamp }: { chatId: string; timestamp: Date }) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)));

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      return await db.delete(message).where(and(eq(message.chatId, chatId), inArray(message.id, messageIds)));
    }
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to delete messages by chat id after timestamp');
  }
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to update chat visibility by id');
  }
}

export async function updateChatTitleById({ chatId, title }: { chatId: string; title: string }) {
  try {
    const [updatedChat] = await db
      .update(chat)
      .set({ title, updatedAt: new Date() })
      .where(eq(chat.id, chatId))
      .returning();
    return updatedChat;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to update chat title by id');
  }
}

export async function getMessageCountByUserId({ id, differenceInHours }: { id: string; differenceInHours: number }) {
  try {
    const now = new Date();
    const startTime = new Date(now.getTime() - differenceInHours * 60 * 60 * 1000);

    return await db
      .select()
      .from(message)
      .where(
        and(
          eq(message.chatId, id),
          gte(message.createdAt, startTime),
          lt(message.createdAt, now)
        )
      );
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get message count by user id');
  }
}

export async function createStreamId({ streamId, chatId }: { streamId: string; chatId: string }) {
  try {
    await db.insert(stream).values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create stream id');
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get stream ids by chat id');
  }
}

export async function getExtremeSearchUsageByUserId({ userId }: { userId: string }) {
  try {
    const now = new Date();
    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Start of next month
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    startOfNextMonth.setHours(0, 0, 0, 0);

    const [usage] = await db
      .select()
      .from(extremeSearchUsage)
      .where(
        and(
          eq(extremeSearchUsage.userId, userId),
          gte(extremeSearchUsage.date, startOfMonth),
          lt(extremeSearchUsage.date, startOfNextMonth),
        ),
      )
      .limit(1);

    return usage;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get extreme search usage');
  }
}

export async function incrementExtremeSearchUsage({ userId }: { userId: string }) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // End of current month for monthly reset
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    endOfMonth.setHours(0, 0, 0, 0);

    const existingUsage = await getExtremeSearchUsageByUserId({ userId });

    if (existingUsage) {
      const [updatedUsage] = await db
        .update(extremeSearchUsage)
        .set({
          searchCount: existingUsage.searchCount + 1,
          updatedAt: new Date(),
        })
        .where(eq(extremeSearchUsage.id, existingUsage.id))
        .returning();
      return updatedUsage;
    } else {
      const [newUsage] = await db
        .insert(extremeSearchUsage)
        .values({
          userId,
          searchCount: 1,
          date: today,
          resetAt: endOfMonth,
        })
        .returning();
      return newUsage;
    }
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to increment extreme search usage');
  }
}

export async function getExtremeSearchCount({ userId }: { userId: string }): Promise<number> {
  try {
    const usage = await getExtremeSearchUsageByUserId({ userId });
    return usage?.searchCount || 0;
  } catch (error) {
    console.error('Error getting extreme search count:', error);
    return 0;
  }
}

export async function getMessageUsageByUserId({ userId }: { userId: string }) {
  try {
    const now = new Date();
    // Start of current day
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    startOfDay.setHours(0, 0, 0, 0);

    // Start of next day
    const startOfNextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    startOfNextDay.setHours(0, 0, 0, 0);

    const [usage] = await db
      .select()
      .from(messageUsage)
      .where(
        and(eq(messageUsage.userId, userId), gte(messageUsage.date, startOfDay), lt(messageUsage.date, startOfNextDay)),
      )
      .limit(1);

    return usage;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to get message usage');
  }
}

export async function incrementMessageUsage({ userId }: { userId: string }) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // End of current day for daily reset
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    endOfDay.setHours(0, 0, 0, 0);

    // Clean up previous day entries for this user
    await db
      .delete(messageUsage)
      .where(and(eq(messageUsage.userId, userId), lt(messageUsage.date, today)));

    const existingUsage = await getMessageUsageByUserId({ userId });

    if (existingUsage) {
      const [updatedUsage] = await db
        .update(messageUsage)
        .set({
          messageCount: existingUsage.messageCount + 1,
          updatedAt: new Date(),
        })
        .where(eq(messageUsage.id, existingUsage.id))
        .returning();
      return updatedUsage;
    } else {
      const [newUsage] = await db
        .insert(messageUsage)
        .values({
          userId,
          messageCount: 1,
          date: today,
          resetAt: endOfDay,
        })
        .returning();
      return newUsage;
    }
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to increment message usage');
  }
}

export async function getMessageCount({ userId }: { userId: string }): Promise<number> {
  try {
    const usage = await getMessageUsageByUserId({ userId });
    return usage?.messageCount || 0;
  } catch (error) {
    console.error('Error getting message count:', error);
    return 0;
  }
}

export async function getDailySearchUsageByUserId({ userId }: { userId: string }) {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // First try to get existing record
    const [usage] = await db
      .select()
      .from(dailySearchUsage)
      .where(
        and(
          eq(dailySearchUsage.userId, userId),
          gte(dailySearchUsage.date, startOfDay),
          lt(dailySearchUsage.date, endOfDay)
        )
      );

    if (!usage) {
      // Create new usage record for today
      const resetAt = new Date(endOfDay);
      const [newUsage] = await db
        .insert(dailySearchUsage)
        .values({
          userId,
          searchCount: 0,
          date: startOfDay,
          resetAt,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      return newUsage;
    }

    // Check if we need to reset the count
    if (now >= usage.resetAt) {
      const resetAt = new Date(endOfDay);
      const [updatedUsage] = await db
        .update(dailySearchUsage)
        .set({
          searchCount: 0,
          date: startOfDay,
          resetAt,
          updatedAt: now,
        })
        .where(eq(dailySearchUsage.id, usage.id))
        .returning();
      return updatedUsage;
    }

    return usage;
  } catch (error) {
    console.error('Error getting daily search usage:', error);
    throw new ChatSDKError('bad_request:database', 'Failed to get daily search usage');
  }
}

export async function incrementDailySearchUsage({ userId }: { userId: string }) {
  return await db.transaction(async (tx) => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      // Get current usage record
      const [usage] = await tx
        .select()
        .from(dailySearchUsage)
        .where(
          and(
            eq(dailySearchUsage.userId, userId),
            gte(dailySearchUsage.date, startOfDay),
            lt(dailySearchUsage.date, endOfDay)
          )
        );

      if (!usage) {
        // Create new usage record for today
        const [newUsage] = await tx
          .insert(dailySearchUsage)
          .values({
            userId,
            searchCount: 1, // Start at 1 for the first search
            date: startOfDay,
            resetAt: endOfDay,
            createdAt: now,
            updatedAt: now,
          })
          .returning();
        return newUsage;
      }

      // Check if we need to reset the count (if past reset time)
      if (now >= usage.resetAt) {
        const [updatedUsage] = await tx
          .update(dailySearchUsage)
          .set({
            searchCount: 1, // Reset to 1 since this is a new search
            date: startOfDay,
            resetAt: endOfDay,
            updatedAt: now,
          })
          .where(eq(dailySearchUsage.id, usage.id))
          .returning();
        return updatedUsage;
      }

      // Increment the existing count using SQL to ensure atomicity
      const [updatedUsage] = await tx
        .update(dailySearchUsage)
        .set({
          searchCount: sql`${dailySearchUsage.searchCount} + 1`,
          updatedAt: now,
        })
        .where(eq(dailySearchUsage.id, usage.id))
        .returning();

      return updatedUsage;
    } catch (error) {
      console.error('Error incrementing daily search usage:', error);
      throw new ChatSDKError('bad_request:database', 'Failed to increment daily search usage');
    }
  });
}

export async function getDailySearchCount({ userId }: { userId: string }): Promise<number> {
  try {
    const usage = await getDailySearchUsageByUserId({ userId });
    return usage?.searchCount || 0;
  } catch (error) {
    console.error('Error getting daily search count:', error);
    return 0;
  }
}

export async function populateDailySearchUsageFromChats() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // First, get all users with their chat counts for today
    const userChatCounts = await db
      .select({
        userId: chat.userId,
        chatCount: sql<number>`count(${chat.id})::int`,
      })
      .from(chat)
      .where(
        and(
          gte(chat.createdAt, startOfDay),
          lt(chat.createdAt, endOfDay)
        )
      )
      .groupBy(chat.userId);

    // For each user with chats, update or create their daily search usage
    for (const { userId, chatCount } of userChatCounts) {
      const [existingUsage] = await db
        .select()
        .from(dailySearchUsage)
        .where(
          and(
            eq(dailySearchUsage.userId, userId),
            gte(dailySearchUsage.date, startOfDay),
            lt(dailySearchUsage.date, endOfDay)
          )
        );

      if (existingUsage) {
        await db
          .update(dailySearchUsage)
          .set({
            searchCount: chatCount,
            updatedAt: now,
          })
          .where(eq(dailySearchUsage.id, existingUsage.id));
      } else {
        await db
          .insert(dailySearchUsage)
          .values({
            userId,
            searchCount: chatCount,
            date: startOfDay,
            resetAt: endOfDay,
            createdAt: now,
            updatedAt: now,
          });
      }
    }

    // For users who haven't created any chats today, ensure they have a record with count 0
    await db.transaction(async (tx) => {
      const usersWithoutChats = await tx
        .select({
          id: user.id,
        })
        .from(user)
        .where(
          notInArray(
            user.id,
            userChatCounts.map((u) => u.userId)
          )
        );

      for (const { id: userId } of usersWithoutChats) {
        const [existingUsage] = await tx
          .select()
          .from(dailySearchUsage)
          .where(
            and(
              eq(dailySearchUsage.userId, userId),
              gte(dailySearchUsage.date, startOfDay),
              lt(dailySearchUsage.date, endOfDay)
            )
          );

        if (!existingUsage) {
          await tx.insert(dailySearchUsage).values({
            userId,
            searchCount: 0,
            date: startOfDay,
            resetAt: endOfDay,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error populating daily search usage:', error);
    throw new ChatSDKError('bad_request:database', 'Failed to populate daily search usage');
  }
}
