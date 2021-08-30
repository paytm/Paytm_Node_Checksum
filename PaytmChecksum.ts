import crypto from "crypto";

export default class PaytmChecksum {
    static #iv = "@@@@&&&&####$$$$";

    static encrypt(input: string, key: string) {
        const cipher = crypto.createCipheriv("AES-128-CBC", key, PaytmChecksum.#iv);
        let encrypted = cipher.update(input, "binary", "base64");
        encrypted += cipher.final("base64");
        return encrypted;
    }

    static decrypt(encrypted: string, key: string) {
        const decipher = crypto.createDecipheriv("AES-128-CBC", key, PaytmChecksum.#iv);
        let decrypted = decipher.update(encrypted, "base64", "binary");
        try {
            decrypted += decipher.final("binary");
        } catch (e) {
            console.log(e);
        }
        return decrypted;
    }
    static generateSignature(params: Record<string, string | number>, key: string) {
        const strParams = PaytmChecksum.getStringByParams(params);
        return PaytmChecksum.generateSignatureByString(strParams, key);
    }

    static verifySignature(params: Record<string, string>, key: string, checksum: string) {
        if (Object.getOwnPropertyNames(params).includes("CHECKSUMHASH")) {
            delete params.CHECKSUMHASH;
        }
        const strParams = PaytmChecksum.getStringByParams(params);
        return PaytmChecksum.verifySignatureByString(strParams, key, checksum);
    }

    static async generateSignatureByString(params: string, key: string) {
        const salt = await PaytmChecksum.generateRandomString(4);
        return PaytmChecksum.calculateChecksum(params, key, salt);
    }

    static verifySignatureByString(params: string, key: string, checksum: string) {
        const paytm_hash = PaytmChecksum.decrypt(checksum, key);
        const salt = paytm_hash.substr(paytm_hash.length - 4);

        return paytm_hash === PaytmChecksum.calculateHash(params, salt);
    }

    static generateRandomString(length: number): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes((length * 3.0) / 4.0, (err, buf) => {
                if (!err) {
                    const salt = buf.toString("base64");
                    resolve(salt);
                } else {
                    console.log("error occurred in generateRandomString: " + err);
                    reject(err);
                }
            });
        });
    }

    static getStringByParams(params: Record<string, string | number>) {
        const data: Record<string, string | number> = {};

        Object.keys(params)
            .sort()
            .forEach((key) => {
                data[key] = params[key]?.toString().toLowerCase() ?? "";
            });
        return Object.values(data).join("|");
    }

    static calculateHash(params: string, salt: string) {
        const finalString = params + "|" + salt;
        return crypto.createHash("sha256").update(finalString).digest("hex") + salt;
    }

    static calculateChecksum(params: string, key: string, salt: string) {
        const hashString = PaytmChecksum.calculateHash(params, salt);
        return PaytmChecksum.encrypt(hashString, key);
    }
}
