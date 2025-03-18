import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Email types
type EmailType = 'new_request' | 'parts_verified';

interface EmailPayload {
  type: EmailType;
  providerEmail: string;
  providerName: string;
  requestId: string;
  requestDetails?: string;
}

interface ResendEmailRequest {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

interface ResendSuccessResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

interface ResendErrorResponse {
  name: string;
  message: string;
  statusCode: number;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  data?: ResendSuccessResponse;
}

// Email template styles
const styles = `
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .header {
      background-color: #FF6B00;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: white;
      padding: 20px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .table th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #FF6B00;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
    }
    .important {
      background-color: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 12px;
      margin: 20px 0;
    }
    .info {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
    }
  </style>
`;

const getNewRequestTemplate = (requestId: string, requestDetails: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      ${styles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Nueva Solicitud de Partes</h1>
          <p>Solicitud #${requestId}</p>
        </div>
        <div class="content">
          <p>Se ha creado una nueva solicitud de partes que requiere tu atención.</p>
          
          <div class="info">
            <strong>Detalles de la Solicitud:</strong>
          </div>
          
          ${requestDetails}
          
          <div class="important">
            <p><strong>Importante:</strong> Por favor revisa y procesa esta solicitud lo antes posible.</p>
          </div>
          
          <div style="text-align: center;">
            <a href="https://app.camheraliados.lat" class="button">
              Ver Solicitud
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Este es un correo automático, por favor no responder.</p>
          <p>© 2024 Camher Aliados. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
  </html>
`;

const getPartsVerifiedTemplate = (requestId: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      ${styles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Partes Verificadas</h1>
          <p>Solicitud #${requestId}</p>
        </div>
        <div class="content">
          <p>Las partes de la solicitud han sido verificadas correctamente.</p>
          
          <div class="info">
            <p>El taller ha confirmado que:</p>
            <ul>
              <li>Todas las partes solicitadas fueron recibidas</li>
              <li>Las cantidades son correctas</li>
              <li>Los precios coinciden con lo acordado</li>
            </ul>
          </div>
          
          <div class="important">
            <p><strong>Siguiente paso:</strong> Ya puedes proceder con la facturación.</p>
          </div>
          
          <div style="text-align: center;">
            <a href="https://app.camheraliados.lat" class="button">
              Proceder con Facturación
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Este es un correo automático, por favor no responder.</p>
          <p>© 2024 Camher Aliados. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
  </html>
`;

const handler = async (request: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await request.json() as EmailPayload;
    const { type, providerEmail, providerName, requestId, requestDetails } = payload;

    const subject = type === 'new_request' 
      ? `Nueva Solicitud de Partes #${requestId}`
      : `Partes Verificadas - Solicitud #${requestId}`;

    const html = type === 'new_request'
      ? getNewRequestTemplate(requestId, requestDetails || '')
      : getPartsVerifiedTemplate(requestId);

    const emailRequest: ResendEmailRequest = {
      from: "Camher <equipo@camheraliados.lat>",
      to: [providerEmail],
      subject,
      html,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailRequest),
    });

    const data = await res.json() as ResendSuccessResponse | ResendErrorResponse;

    // Check if response is an error
    if ('statusCode' in data) {
      const errorResponse: ApiResponse = {
        success: false,
        error: data.message
      };
      
      return new Response(JSON.stringify(errorResponse), {
        status: data.statusCode,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const successResponse: ApiResponse = {
      success: true,
      data: data as ResendSuccessResponse
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Error al procesar la solicitud de correo'
    };

    return new Response(JSON.stringify(errorResponse), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);