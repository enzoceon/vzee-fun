
# vzee.fun

A simple web application that lets users upload audio files and share them with a unique link.

## Environment Variables

For the application to work correctly, you'll need to set up the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Setting up environment variables for deployment on Vercel:
1. Go to your Vercel project
2. Click on "Settings" > "Environment Variables"
3. Add the above environment variables

### Setting up Supabase Google Authentication:
1. Go to your Supabase project
2. Navigate to Authentication > Providers > Google
3. Enable Google authentication
4. Enter your Google client ID and secret
5. Add the necessary redirect URLs (your Vercel domain)
6. Make sure to configure your Google OAuth consent screen and credentials in Google Cloud Console
