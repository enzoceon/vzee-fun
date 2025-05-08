
# vzee.fun

A simple web application that lets users upload audio files and share them with a unique link.

## Environment Variables

For the application to work correctly, you **MUST** set up the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Setting up environment variables for deployment on Vercel:
1. Go to your Vercel project
2. Click on "Settings" > "Environment Variables"
3. Add the above environment variables with your Supabase project values
4. Redeploy your application for the changes to take effect

### Setting up Supabase Google Authentication:
1. Go to your Supabase project
2. Navigate to Authentication > Providers > Google
3. Enable Google authentication
4. Enter your Google client ID and secret
5. Add the necessary redirect URLs (your Vercel domain)
6. Make sure to configure your Google OAuth consent screen and credentials in Google Cloud Console

### Troubleshooting:
If you encounter an "Access blocked: Authorization Error" or other authentication issues:
1. Verify that your Supabase URL and anon key are correctly set as environment variables
2. Check that your Google OAuth credentials are properly configured
3. Make sure the redirect URIs in your Google Cloud Console match your deployed domain
4. Verify that your Supabase project has Google Auth provider enabled

