import Image from 'next/image';

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
      src="https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1759034358692-scira.png"
      alt="Scira Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
