// Gemini AI Service

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';

window.GeminiService = {
    // Basic completion
    async generateContent(prompt, apiKey, model = 'gemini-2.5-flash') {
        const url = `${GEMINI_API_URL}${model}:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API Request Failed');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    },

    // Test connection (simple generation)
    async testConnection(apiKey) {
        try {
            await this.generateContent('Say "Connected"', apiKey, 'gemini-2.5-flash');
            return true;
        } catch (error) {
            console.error('Connection Test Failed:', error);
            return false;
        }
    }
};
