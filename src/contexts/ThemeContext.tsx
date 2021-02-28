import { createContext, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { Themes } from '../Utils/Themes'

interface ThemeContextData {
    handleUpdateTheme: () => void
    themeName: String
}

interface ThemeProviderProps {
    children: ReactNode
    themeName: String
}

export const ThemeContext = createContext({} as ThemeContextData)

export function ThemeProvider({
    children,
    ...rest
}: ThemeProviderProps) {
    const [themeName, setThemeName] = useState(rest.themeName)
    const [theme, setTheme] = useState(Themes[themeName === "dark" ? 1 : 0])

    useEffect(() => {
        Cookies.set('themeName', String(themeName))
    }, [themeName])

    function handleUpdateTheme() {
        if (theme === Themes[1]) {
            setTheme(Themes[0])
            setThemeName("light")
        } else {
            setTheme(Themes[1])
            setThemeName("dark")
        }
    }

    function setCSSVariables(theme: { [x: string]: string }) {
        for (const value in theme) {
            document.documentElement.style.setProperty(`--${value}`, theme[value])
        }
    }
    useEffect(() => {
        setCSSVariables(theme)
    }, [theme])

    return (
        <ThemeContext.Provider
            value={{
                handleUpdateTheme,
                themeName,
            }}>
            {children}
        </ThemeContext.Provider>
    )
}