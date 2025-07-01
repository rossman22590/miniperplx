import Image from 'next/image';

export function ElevenLabsLightLogo() {
  return (
    <Image
      src="/elevenlabs-light.svg"
      alt="ElevenLabs Logo"
      width={120}
      height={24}
      className="h-6"
    />
  );
}

export function ElevenLabsDarkLogo() {
  return (
    <Image
      src="/elevenlabs-dark.svg"
      alt="ElevenLabs Logo"
      width={120}
      height={24}
      className="h-6"
    />
  );
} 