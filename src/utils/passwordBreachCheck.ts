async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function checkPasswordBreach(password: string): Promise<{
  isBreached: boolean;
  count: number;
  error?: string;
}> {
  try {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5).toUpperCase();
    const suffix = hash.substring(5).toUpperCase();

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'Add-Padding': 'true',
      },
    });

    if (!response.ok) {
      return {
        isBreached: false,
        count: 0,
        error: 'Unable to check password breach status',
      };
    }

    const text = await response.text();
    const hashes = text.split('\n');

    for (const line of hashes) {
      const [hashSuffix, countStr] = line.split(':');
      if (hashSuffix === suffix) {
        const count = parseInt(countStr, 10);
        return {
          isBreached: true,
          count,
        };
      }
    }

    return {
      isBreached: false,
      count: 0,
    };
  } catch (error) {
    console.error('Password breach check failed:', error);
    return {
      isBreached: false,
      count: 0,
      error: 'Unable to check password breach status',
    };
  }
}
