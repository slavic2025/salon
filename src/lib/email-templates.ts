// src/lib/email-templates.ts

interface AppointmentConfirmationProps {
  clientName: string
  formattedDate: string
  duration: number
}

export function getAppointmentConfirmationEmail({
  clientName,
  formattedDate,
  duration,
}: AppointmentConfirmationProps): string {
  // Recomandare: Folosește o librărie precum React Email pentru template-uri complexe.
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Salut, ${clientName}!</h2>
        <p>Programarea ta a fost confirmată pentru ${formattedDate}.</p>
        <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #111827; margin-top: 0;">Detalii Programare:</h3>
          <p><strong>Data și ora:</strong> ${formattedDate}</p>
          <p><strong>Durata:</strong> ${duration} minute</p>
        </div>
        <p>Dacă ai întrebări, nu ezita să ne contactezi.</p>
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
          Acest email este generat automat, te rugăm să nu răspunzi la acest mesaj.
        </p>
      </div>
    `
}
