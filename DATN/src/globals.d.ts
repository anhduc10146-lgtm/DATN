import { RecaptchaVerifier } from "firebase/auth";

export { };

declare global {
    interface Window {
        recaptchaVerfier: RecaptchaVerifier;
        confirmationResult: import("firebase/auth").ConfirmationResult;
    }
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}