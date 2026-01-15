import confetti from 'canvas-confetti';

// Generate random numbers for the secret code
// Supports test mocking via window.__mockRndNumbers__
export function generateRandomNumbers(count) {
  // Check for test mock first
  if (typeof window !== 'undefined' && window.__mockRndNumbers__) {
    return window.__mockRndNumbers__();
  }
  return Array.from({ length: count }, () => Math.floor(Math.random() * 10));
}




// Custom hook-like function for state
export const createState = (initialValue, onChange) => {
    let state = initialValue;
    const setState = (newValue) => {
        state = typeof newValue === 'function' ? newValue(state) : newValue;
        if (typeof onChange === 'function') onChange(state);
    };
    const getState = () => state;
    return [getState, setState];
};

export const isInCorrectPlace = (a, b) =>
    a.length !== b.length ? 0 : a.filter((val, i) => val === b[i]).length;

export const isCorrect = (a, b) => {
    if (a.length !== b.length) return 0;
    const copy = [...b];
    return a.reduce((acc, val) => {
        const i = copy.indexOf(val);
        if (i !== -1) {
            copy[i] = null;
            acc++;
        }
        return acc;
    }, 0);
};


// export const 
export const celebrate = () => {
    if(window.celebrate) {
        window.celebrate();
    }
    // burst confetti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    // fireworks effect with multiple bursts
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();

}

const inPlace = "⚫";
const correct = "⚪️";

export const getFeedback = (correctPlace, correctTotal)=>{
    return `${inPlace}`.repeat(correctPlace) + `${correct}`.repeat(correctTotal - correctPlace) +(correctTotal === 0 ? '-' : '');
}

/**
 * Sets up a MutationObserver to automatically scroll an element to the bottom
 * when its content changes (new children are added).
 * @param {HTMLElement | null} element - The HTML element to scroll to bottom when content changes
 * @returns {(() => void) | null} A cleanup function to disconnect the observer, or null if element is invalid
 */
export const scrollToBottom = (element) => {
  if (!element) {
    return null;
  }

  const observer = new MutationObserver(() => {
    // Scroll to bottom (which shows newest guess with column)
    element.scrollTop = element.scrollHeight;
  });
  
  observer.observe(element, {
    childList: true,
    subtree: true
  });

  // Return cleanup function
  return () => observer.disconnect();
};

// Auto-scroll guessesDisplay to bottom when new guesses are added
// This function should be called after guessesDisplay is created in the DOM
let cleanupScroll = null;
export function initializeAutoScroll() {
  // Disconnect existing observer if it exists
  if (cleanupScroll) {
    cleanupScroll();
    cleanupScroll = null;
  }
  
  requestAnimationFrame(() => {
    const guessesDisplay = document.getElementById('guessesDisplay');
    if (guessesDisplay) {
      cleanupScroll = scrollToBottom(guessesDisplay);
    }
  });
}
