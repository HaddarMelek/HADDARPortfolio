import React, {createContext, useContext, useEffect, useState} from 'react'
import {useData} from "/src/providers/DataProvider.jsx"

const LanguageContext = createContext(null)
export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({children}) => {
    const {getSettings, getStrings} = useData()

    const settings = getSettings()
    const strings = getStrings()

    const languagesData = settings.supportedLanguages // garder les données brutes
    const localStorageName = 'language-preferences'
    const canChangeLanguage = languagesData.length >= 2

    const [defaultLanguageId, setDefaultLanguageId] = useState(null)
    const [selectedLanguageId, setSelectedLanguageId] = useState(null)

    useEffect(() => {
        const defaultLanguage = languagesData.find(lang => lang.default) || languagesData[0]
        setDefaultLanguageId(defaultLanguage.id)

        const localStorageItem = window.localStorage.getItem(localStorageName)
        const savedLanguage = languagesData.find(lang => lang.id === localStorageItem)
        if(savedLanguage) {
            setSelectedLanguage(savedLanguage)
            return
        }

        const detectedLanguage = languagesData.find(lang => navigator.language.includes(lang['id'])) || defaultLanguage
        setSelectedLanguage(detectedLanguage)
    }, [])

    const setSelectedLanguage = (language) => {
        if(language) {
            setSelectedLanguageId(language.id)
            window.localStorage.setItem(localStorageName, language.id.toString())
        }
    }

    const getSelectedLanguage = () => {
        return languagesData.find(lang => lang.id === selectedLanguageId)
    }

    const getAvailableLanguages = () => {
        return languagesData.filter(lang => lang.id !== selectedLanguageId)
    }

    const getTranslation = (locales, key, shouldReturnNullIfNotFound) => {
        if(!selectedLanguageId || !locales) return "locale:" + key

        const selectedTranslations = locales[selectedLanguageId]
        if(selectedTranslations && selectedTranslations[key]) return selectedTranslations[key]

        const defaultTranslations = locales[defaultLanguageId]
        if(defaultTranslations && defaultTranslations[key]) return defaultTranslations[key]

        return !shouldReturnNullIfNotFound ? "locale:" + key : null
    }

    const getString = (key) => getTranslation(strings['locales'], key)

    // JSX pour affichage des cercles EN / FR
    const languageCircles = languagesData.map(lang => (
        <div key={lang.id} className="language-circle">
            <span>{lang.id.toUpperCase()}</span>
        </div>
    ))

    return (
        <LanguageContext.Provider value={{
            selectedLanguageId,
            canChangeLanguage,
            setSelectedLanguage,
            getSelectedLanguage,
            getAvailableLanguages,
            getTranslation,
            getString,
            languageCircles
        }}>
            {selectedLanguageId && <>{children}</>}
        </LanguageContext.Provider>
    )
}
