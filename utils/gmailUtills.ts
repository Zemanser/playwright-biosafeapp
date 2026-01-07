import { google, Auth } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const CREDENTIALS_PATH = path.join(__dirname, './data/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../data/token.json');

export async function autenticate(): Promise<Auth.OAuth2Client> {

    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error("No se encontró credentials.json en ./data. Descarga las credenciales de Google Cloud.");
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8')).web;
    const { client_id, client_secret } = credentials;
    const redirect_uris = ['http://localhost'];

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        throw new Error("No se encontró token.json. Primero ejecuta 'npx tsx generateToken.ts' para generarlo");
    }

    console.log("Cargando token desde token.json...");
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
    console.log("Token cargado correctamente.");

    return oAuth2Client;
}
export async function getVerificationCode(): Promise<string> {
    try {
        // Autenticamos el usuario utilizando el token generado
        const auth = await autenticate();
        const gmail = google.gmail({ version: 'v1', auth });  

        console.log("Buscando el código de verificación en los correos...");

        const res = await gmail.users.messages.list({
            userId: 'me',
            q: 'from:soporte@biosafeapp.com subject:"Tu código de verificación de BiosafeApp"',
            maxResults: 1,
        });

        if (!res.data.messages) {
            console.error("No se encontraron correos de verificación.");
            return '';
        }

        const messageId = res.data.messages[0].id!;
        const message = await gmail.users.messages.get({ userId: 'me', id: messageId });

        const body = message.data.snippet || '';
        console.log("Cuerpo del correo recibido:", body);

        // buscamos un numero de 6 digitos en el cuerpo del correo
        const codeMatch = body.match(/\b\d{6}\b/);
        if (!codeMatch) {
            console.error(" No se encontró el código de verificación de 6 dígitos en el correo");
            return '';
        } else {
            return codeMatch[0];
        }
    } catch (error) {
        console.error("Error al obtener el código de verificación:", error);
        return '';
    }
}