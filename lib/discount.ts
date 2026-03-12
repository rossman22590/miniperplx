import { get } from '@vercel/edge-config';

export interface DiscountConfig {
  enabled: boolean;
  message?: string;
  code?: string;
  percentage?: number;
  originalPrice?: number;
  finalPrice?: number;
  inrPrice?: number;
  showPrice?: boolean;
  buttonText?: string;
  dev?: boolean;
  isStudentDiscount?: boolean;
  dodoDiscountId?: string;
  discountId?: string;
}

export function isStudentEmail(email: string, studentDomains: string[]): boolean {
  if (!email || typeof email !== 'string') return false;
  if (!studentDomains || studentDomains.length === 0) return false;

  const lowerEmail = email.toLowerCase();
  const emailParts = lowerEmail.split('@');
  if (emailParts.length !== 2) return false;

  const domain = emailParts[1];

  return studentDomains.some((pattern) => {
    const lowerPattern = pattern.toLowerCase();

    if (lowerPattern === '.edu') {
      return domain.endsWith('.edu') || /\.edu\.[a-z]{2,3}$/.test(domain);
    }

    return domain.endsWith(lowerPattern);
  });
}

export async function getDiscountConfig(userEmail?: string, isIndianUser?: boolean): Promise<DiscountConfig> {
  const defaultConfig: DiscountConfig = {
    enabled: false,
    isStudentDiscount: false,
  };

  if (!userEmail) {
    return defaultConfig;
  }

  const hasEdgeConfigConnection = Boolean(process.env.EDGE_CONFIG || process.env.VERCEL_EDGE_CONFIG);

  let studentDomains: string[] = [];

  try {
    if (hasEdgeConfigConnection) {
      const studentDomainsConfig = await get('student_domains');
      if (studentDomainsConfig && typeof studentDomainsConfig === 'string') {
        studentDomains = studentDomainsConfig
          .split(',')
          .map((domain) => domain.trim())
          .filter((domain) => domain.length > 0);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch student domains from Edge Config:', error);
  }

  if (studentDomains.length === 0) {
    studentDomains = ['.edu', '.ac.in', '.edu.in'];
  }

  if (!isStudentEmail(userEmail, studentDomains)) {
    return defaultConfig;
  }

  return {
    enabled: true,
    message: 'Student discount applied',
    percentage: isIndianUser ? 70 : 67,
    originalPrice: isIndianUser ? 1500 : 15,
    finalPrice: 5,
    inrPrice: isIndianUser ? 450 : undefined,
    showPrice: true,
    buttonText: 'Claim student pricing',
    dev: process.env.NODE_ENV === 'development',
    isStudentDiscount: true,
    dodoDiscountId: process.env.DODO_STUD_DISC_ID || '',
    discountId: process.env.DODO_STUD_DISC_ID || '',
  };
}
