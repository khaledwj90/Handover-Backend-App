// @flow

export interface FirebaseInterface {
    messaging: *;

    sendFCMMessage(tokens: string[], payload: { event: string, location: string }): Promise<void>;
}
