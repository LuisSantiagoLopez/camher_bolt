import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PartUpdate {
  id: string
  status?: number
  reqDate?: string
  failureReport?: {
    problemLocation?: string
    operator?: string
    description?: string
  }
  workOrder?: {
    jobToBeDone?: string
    personInCharge?: string
    sparePart?: string
    observation?: string
  }
  partReq?: {
    partDescription?: string[]
    price?: number
    unitaryPrice?: number[]
    quantity?: number[]
    isCash?: boolean
    isImportant?: boolean
  }
  invoiceInfo?: {
    number?: string
    date?: string
    subTotal?: number
  }
  providerID?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    const update: PartUpdate = await req.json()

    // Validate required fields
    if (!update.id) {
      throw new Error('Missing required field: id')
    }

    // Update part
    const { data, error } = await supabaseClient
      .from('parts')
      .update(update)
      .eq('id', update.id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        data,
        message: 'Part updated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Update error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Part update failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})