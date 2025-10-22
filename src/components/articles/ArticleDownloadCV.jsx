import React, { useEffect, useState } from 'react'
import { useLanguage } from '/src/providers/LanguageProvider.jsx'

export default function DownloadCV() {
    const { selectedLanguageId: language } = useLanguage()
    const [data, setData] = useState(null)
    const [locale, setLocale] = useState(null)
    const [cvFile, setCvFile] = useState('')

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/sections/downloadcv.json`)
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        if (!data || !language) return
        const section = data.articles[0]
        const item = section.items[0]
        const selectedLocale = item.locales[language] || item.locales['en']
        setLocale(selectedLocale)
        setCvFile(`${import.meta.env.BASE_URL}${selectedLocale.file.replace(/^\//, '')}`)
    }, [data, language])

    if (!data || !locale) return <p>Loading...</p>

    const section = data.articles[0]

    return (
        <div className="download-cv section download-cv--centered">
            <p>{locale.text}</p>
            <a className={`btn ${section.config.buttonType || 'primary'}`} href={cvFile} download target="_blank" rel="noopener noreferrer">
                {locale.buttonText}
            </a>
        </div>
    )
}
