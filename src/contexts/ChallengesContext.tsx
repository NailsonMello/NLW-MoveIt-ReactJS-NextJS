import { createContext, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'
import { Themes } from '../Utils/Themes'

interface Challenge {
    type: 'body' | 'eye'
    description: string
    amount: number
}

interface ChallengesContextData {
    level: number
    currentExperience: number
    challengesCompleted: number
    activeChallenge: Challenge
    experienceToNextLevel: number
    levelUp: () => void
    CloseLevelUpMOdal: () => void
    startNewChallenge: () => void
    resetChallenge: () => void
    completeChallenge: () => void
    handleUpdateTheme: () => void
    themeName: String
}

interface ChallengesProviderProps {
    children: ReactNode
    level: number
    currentExperience: number
    challengesCompleted: number
    themeName: String
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({
    children,
    ...rest
}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const [themeName, setThemeName] = useState(rest.themeName ?? "dark")
    const [theme, setTheme] = useState(Themes[themeName === "dark" ? 1 : 0])

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengesCompleted', String(challengesCompleted))
    }, [level, currentExperience, challengesCompleted])

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

    function levelUp() {
        setLevel(level + 1)
        setIsLevelUpModalOpen(true)
    }

    function CloseLevelUpMOdal() {
        setIsLevelUpModalOpen(false)
    }

    function startNewChallenge() {
        const randomChallengesIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengesIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return
        }

        const { amount } = activeChallenge

        let finalExperience = currentExperience + amount

        if (finalExperience >= experienceToNextLevel) {
            levelUp()
            finalExperience = finalExperience - experienceToNextLevel
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    return (
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                challengesCompleted,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge,
                CloseLevelUpMOdal,
                handleUpdateTheme,
                themeName,
            }}>
            {children}
            { isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}