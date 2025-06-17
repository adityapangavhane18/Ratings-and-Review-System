function extractTagsFromReviews(reviews) {
    const stopWords = new Set([
        'the', 'is', 'and', 'to', 'it', 'a', 'of', 'for', 'this', 'that', 'with', 'on', 'in', 'was', 'very', 'but', 'are'
    ]);

    const wordCounts = {};

    for (const review of reviews) {
        if (!review.review) continue;
        const words = review.review.toLowerCase().split(/\W+/);
        for (const word of words) {
            if (!stopWords.has(word) && word.length > 2) {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        }
    }


    return Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
}

module.exports = { extractTagsFromReviews };