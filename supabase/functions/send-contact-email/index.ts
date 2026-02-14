// follow the guide: https://supabase.com/docs/guides/functions
// deploy with: supabase functions deploy send-contact-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// You will need to set RESEND_API_KEY in your Supabase project secrets
// supabase secrets set RESEND_API_KEY=your_api_key

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        let email = body.email
        let message = body.message

        // Handle Supabase Database Webhook payload
        if (body.type === 'INSERT' && body.table === 'contact_messages' && body.record) {
            email = body.record.email
            message = body.record.message
        }

        if (!email || !message) {
            throw new Error('Missing email or message')
        }

        if (!RESEND_API_KEY) {
            console.error('Missing RESEND_API_KEY')
            // We don't fail the request to the client if the email fails, we just log it
            // But for this example, we will return an error so the user knows
            return new Response(
                JSON.stringify({ error: 'Server configuration error (missing email key)' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500,
                }
            )
        }

        // Example using Resend (recommended for Supabase)
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Memora Contact Form <onboarding@resend.dev>', // Or your verified domain
                to: 'rajli.contact@gmail.com',
                subject: `New Contact Message from ${email}`,
                html: `
          <h1>New Contact Message</h1>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
            }),
        })

        const data = await res.json()

        return new Response(
            JSON.stringify(data),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
