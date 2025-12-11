import fs from "fs";
import path from "path";

export function renderGiftCardTemplate(params: {
    code: string;
    amountFormatted: string;
    recipientName?: string | null;
    expiresAt?: string | null;
    siteUrl: string;
}) {
    const templatePath = path.join(process.cwd(),"lib","mail-mjml", "gift-card.html");
    let html = fs.readFileSync(templatePath, "utf8");

    // Remplacements simples
    html = html.replace(/{{code}}/g, params.code);
    html = html.replace(/{{amountFormatted}}/g, params.amountFormatted);
    html = html.replace(/{{siteUrl}}/g, params.siteUrl);

    html = html.replace(/{{year}}/g, String(new Date().getFullYear()));

    html = html.replace(/{{recipientName}}/g, params.recipientName ?? "");

    html = html.replace(/{{expiresAt}}/g, params.expiresAt ?? "");

    return html;
}