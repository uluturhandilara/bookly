import { SignIn } from "@clerk/nextjs";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const params = await searchParams;
  const redirectUrl = params.redirect_url || "/";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center pt-20">
      <SignIn
        fallbackRedirectUrl={redirectUrl}
        signUpFallbackRedirectUrl={redirectUrl}
      />
    </div>
  );
}
