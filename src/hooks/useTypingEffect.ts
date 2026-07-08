import { useEffect, useState } from 'react'

const TYPING_SPEED = 90
const DELETING_SPEED = 55
const PAUSE_AFTER_TYPE = 1800
const PAUSE_AFTER_DELETE = 400

export function useTypingEffect(words: readonly string[]) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    if (!isDeleting && displayText === currentWord) {
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayText === '') {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }, PAUSE_AFTER_DELETE)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      const nextLength = isDeleting
        ? displayText.length - 1
        : displayText.length + 1

      setDisplayText(currentWord.slice(0, nextLength))
    }, isDeleting ? DELETING_SPEED : TYPING_SPEED)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex, words])

  return { displayText, activeWordIndex: wordIndex }
}
