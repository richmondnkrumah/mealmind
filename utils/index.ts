export const convertInstructions = (instructions: string[]) => {
    return instructions.map((step, index) => ({
        title: `Step ${index + 1}`,
        subtitle: step,
        status: index === 1 ? 'registered' : 'upcoming',
    }))
}