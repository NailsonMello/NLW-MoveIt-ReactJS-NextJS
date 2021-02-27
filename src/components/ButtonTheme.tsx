import { useContext } from 'react'
import { HiMoon } from 'react-icons/hi'
import { CgSun } from 'react-icons/cg'

import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/ButtonTheme.module.css';

export function ButtonTheme() {
    const { themeName, handleUpdateTheme } = useContext(ChallengesContext);
    const icon = themeName === "dark" ? <CgSun size={30} /> : <HiMoon size={30} />
    return (
        <span
            className={styles.btnTheme}
            onClick={handleUpdateTheme}>
            {icon}
        </span>
    )
}