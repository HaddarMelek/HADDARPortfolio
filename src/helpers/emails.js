import emailjs from "@emailjs/browser";

const _status = {
    didInit: false,
    config: null
}

export const useEmails = () => {
    const init = (config) => {
        console.log("Initializing EmailJS with config:", config)
        emailjs.init(config.publicKey)
        _status.config = config
        _status.didInit = true
    }

    const isInitialized = () => {
        return _status.didInit
    }

    const sendContactEmail = async (fromName, fromEmail, subject, message) => {
        if(!isInitialized()) {
            console.error("EmailJS not initialized")
            return false
        }

        const params = {
            name: fromName,
            email: fromEmail,
            title: subject,
            message: message,
            time: new Date().toLocaleString()
        }

        console.log("Sending EmailJS with params:", params)

        try {
            const response = await emailjs.send(
                _status.config.serviceId,
                _status.config.templateId,
                params,
                _status.config.publicKey
            )
            console.log("EmailJS response:", response)
            return true
        } catch (error) {
            console.error("EmailJS send error:", error)
            return false
        }
    }

    return {
        init,
        isInitialized,
        sendContactEmail
    }
}
