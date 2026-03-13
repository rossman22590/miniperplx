import Image from 'next/image';
import { APP_LOGO_URL } from '@/lib/constants';

export function SciraLogo({
  className,
  width = 32,
  height = 32,
  color = 'currentColor',
}: {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Image
      src={APP_LOGO_URL}
      alt="Datavibes Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
