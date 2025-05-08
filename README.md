

# vzee.fun

A simple web application that lets users upload audio files and share them with a unique link.

## Environment Variables

For the application to work correctly, you **MUST** set up the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Setting up environment variables:

#### For Local Development:
1. Create a `.env` file in the root directory of your project
2. Add the above environment variables with your Supabase project values
3. Restart your development server

#### For Vercel Deployment:
1. Go to your Vercel project
2. Click on "Settings" > "Environment Variables"
3. Add the above environment variables with your Supabase project values
4. Redeploy your application for the changes to take effect

### Setting up Supabase Google Authentication:
1. Go to your Supabase project
2. Navigate to Authentication > Providers > Google
3. Enable Google authentication
4. Enter your Google client ID (763178151866-bft0v9p1q4vmekfg0btrc4c3isi58r0t.apps.googleusercontent.com)
5. Enter your Google client secret from Google Cloud Console
6. Add the necessary redirect URLs (your Vercel domain or localhost for development)
7. Make sure to configure your Google OAuth consent screen in Google Cloud Console

### Troubleshooting Common Issues:

#### "Cannot read properties of null (reading 'useState')" or "Cannot read properties of null (reading 'useEffect')":
This typically indicates an issue with React context. Ensure:
1. You've imported React correctly in all files using React hooks
2. You're not using hooks outside of React components
3. React providers are properly nested

#### "supabaseUrl is required":
1. Double-check that your environment variables are correctly set
2. For Vercel: Verify environment variables are properly configured in the Vercel dashboard
3. For local: Make sure your .env file is in the correct location and has the correct format

#### "Access blocked: Authorization Error":
1. Verify that your Google OAuth credentials are properly configured
2. Ensure redirect URIs in your Google Cloud Console match your deployed domain
3. Check that your Supabase project has Google Auth provider enabled with correct settings
4. Verify that your application is using the correct Supabase project URL and anon key

If issues persist, check the browser console for more detailed error messages.

