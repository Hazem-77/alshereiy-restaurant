const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

export function validateEnvVars(): {
  valid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    if (!value || value.startsWith("your-")) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    warnings.push(
      `Missing env vars: ${missing.join(", ")}. Admin features will not work.`
    );
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}
