
export const navigateToWithoutHistory = (to: string) => {
    window.history.replaceState({}, document.title, to)
    // dont use navigate(PATHS.CARD) because it will not cause a reload
    window.location.href = to
  }