/**
 * chatbot.js - Client-Side Rule-Based Chatbot Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fab = document.getElementById('j1-chat-fab');
    const chatWindow = document.getElementById('j1-chat-window');
    const closeBtn = document.getElementById('j1-chat-close-btn');
    const inputField = document.getElementById('j1-chat-input');
    const sendBtn = document.getElementById('j1-chat-send-btn');
    const messagesContainer = document.getElementById('j1-chat-messages');

    // Chatbot State
    let isChatOpen = false;
    let hasWelcomed = false;

    // Predefined FAQ Rules for Mount Kato
    const faqRules = [
        {
            keywords: ['hello', 'hi', 'hey', 'greetings'],
            answer: "Welcome to Mount Kato! How can I help you today?"
        },
        {
            keywords: ['pricing', 'cost', 'price', 'how much', 'ticket', 'passes'],
            answer: "We offer discounted Season Passes online, as well as daily lift tickets. Please check out the /tickets page on our website for detailed pricing information."
        },
        {
            keywords: ['contact', 'support', 'help', 'email', 'phone', 'call'],
            answer: "You can reach our main office at (507) 625-3363 or email us at mail@mountkato.com. For the snow report, call (800) 668-5286."
        },
        {
            keywords: ['address', 'location', 'where', 'directions'],
            answer: "We are located at 20461 Hwy 66, Mankato, MN 56001 in the beautiful Minnesota River Valley."
        },
        {
            keywords: ['hours', 'open', 'time', 'when'],
            answer: "Our general winter hours are: Mon, Tue, Thu, Fri, Sat (9:30 AM – 10:00 PM), Wed (9:30 AM – 4:30 PM), and Sun (9:30 AM – 9:00 PM). Please check the website for holiday hours or changes due to weather."
        },
        {
            keywords: ['activities', 'do', 'ski', 'snowboard', 'tube', 'tubing', 'trails', 'lift'],
            answer: "We offer skiing, snowboarding, and a dedicated snow tubing park! Mount Kato features 55 acres of skiable terrain, 19 runs, 8 chairlifts, and 3 terrain parks."
        },
        {
            keywords: ['lesson', 'learn', 'rent', 'equipment'],
            answer: "Yes, we offer equipment rentals as well as skiing and snowboarding lessons. Group programs are also available."
        }
    ];

    const fallbackAnswer = "I'm sorry, I don't understand that question. Could you please rephrase, or contact us directly at (507) 625-3363 or mail@mountkato.com?";

    // Initialize Lunr Search Index for FAQs
    let faqIndex = null;
    const faqDocuments = faqRules.map((rule, index) => ({
        id: index.toString(),
        keywords: rule.keywords.join(" "),
        answer: rule.answer
    }));

    // If lunr is loaded on the page, build the index
    if (typeof lunr !== 'undefined') {
        faqIndex = lunr(function () {
            this.ref('id');
            this.field('keywords', { boost: 10 });
            this.field('answer');

            faqDocuments.forEach(function (doc) {
                this.add(doc);
            }, this);
        });
    }

    // Toggle Chat Window
    function toggleChat() {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.add('j1-chat-open');
            fab.style.transform = 'scale(0)'; // hide FAB
            inputField.focus();
            
            // Send welcome message if first time opening
            if (!hasWelcomed) {
                setTimeout(() => {
                    appendMessage("Hi! I'm the Mount Kato site assistant. Ask me anything about our hours, tickets, location, or activities.", 'bot');
                    hasWelcomed = true;
                }, 400);
            }
        } else {
            chatWindow.classList.remove('j1-chat-open');
            fab.style.transform = 'scale(1)'; // show FAB
        }
    }

    // Event Listeners for opening/closing
    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Send Message Logic
    function handleSend() {
        const text = inputField.value.trim();
        if (text === '') return;

        // Append user message
        appendMessage(text, 'user');
        inputField.value = '';

        // Process bot response after a short delay to simulate "thinking"
        setTimeout(() => {
            const response = getBotResponse(text);
            appendMessage(response, 'bot');
        }, 600 + Math.random() * 400); // 600ms - 1000ms delay
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // Helper: Append a message to the UI
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('j1-msg');
        msgDiv.classList.add(sender === 'user' ? 'j1-msg-user' : 'j1-msg-bot');
        msgDiv.textContent = text;
        
        messagesContainer.appendChild(msgDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Rule-based logic engine
    function getBotResponse(input) {
        // Try searching with Lunr if it's available and initialized
        if (faqIndex && typeof lunr !== 'undefined') {
            // Lunr handles stemming and stop words automatically
            // Adding a small wildcard allows partial matches like "ticket" matching "tickets"
            const searchTokens = input.split(/\s+/).map(token => token + '*').join(' ');
            
            try {
                // Try searching with wildcard tokens for broader matches
                let results = faqIndex.search(searchTokens);
                
                // If no results, try the exact input
                if (results.length === 0) {
                     results = faqIndex.search(input);
                }

                if (results.length > 0) {
                    // Return the answer for the highest scoring result
                    const bestMatchId = parseInt(results[0].ref, 10);
                    return faqDocuments[bestMatchId].answer;
                }
            } catch (e) {
                console.error("Chatbot Lunr search error:", e);
            }
        } 
        
        // Fallback to simple keyword matching if Lunr isn't loaded or throws an error
        const lowerInput = input.toLowerCase();
        for (const rule of faqRules) {
            if (rule.keywords.some(keyword => lowerInput.includes(keyword))) {
                return rule.answer;
            }
        }

        // Return fallback if no rules match
        return fallbackAnswer;
    }
});
