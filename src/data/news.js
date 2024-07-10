import news1 from '../assets/news1.jpg';
import news2 from '../assets/news2.jpg';
import news3 from '../assets/news3.jpg';
import news4 from '../assets/news4.jpg';
import news5 from '../assets/news5.jpg';
import news1_1 from '../assets/news1_1.jpg';
import news2_1 from '../assets/news2_1.jpg';
import news3_1 from '../assets/news3_1.jpg';
import news4_1 from '../assets/news4_1.png';
import news5_1 from '../assets/news5_1.jpg';

// Function to generate unique random views
const generateRandomViews = () => {
  const viewsSet = new Set();
  while (viewsSet.size < 5) {
    viewsSet.add(`${Math.floor(Math.random() * (50000 - 10000 + 1) + 10000).toLocaleString()}K`);
  }
  return Array.from(viewsSet);
};

// Function to generate unique random times in ascending order
const generateRandomTimes = () => {
  const timesSet = new Set();
  while (timesSet.size < 5) {
    timesSet.add(Math.floor(Math.random() * 48 + 1));
  }
  return Array.from(timesSet).sort((a, b) => a - b).map(hours => `${hours} hours ago`);
};

const views = generateRandomViews();
const times = generateRandomTimes();

export const news = [
  {
    id: "0",
    image: news1,
    title: "How to Join the XION Airdrop: Read this before joining",
    time: times[0],
    views: views[0],
    intro: `
      Put a nice short intro and a hook to hold the reader so that he can read more
    `,
    image2: news1_1,
    content: `
      <b>Bold Text Example</b> /n 
      <f20>Font Size 20 Example</f> /n 
      <c#FF5733>Color Example</c> /n 
      <ce>Centered Text Example</ce> /n 
      <u>Underlined Text Example</u> /n 
      <i>Italic Text Example</i> /n 
      <bc#000000>Background Color Example</bc> /n 
      <ol><li>Ordered List Item 1</li><li>Ordered List Item 2</li></ol> /n 
      <ul><li>Unordered List Item 1</li><li>Unordered List Item 2</li></ul> /n
      <pre>Preformatted Text Example</pre>
    `,
    content_and_conclusion: `
      You talk more about the content here and then conclude here
      and also make sure that you give <b>necessary</b> disclaimer
    `,
  },
  {
    id: "1",
    image: news2,
    title: "Crypto Market Volatility: Strategies for Investors in a Turbulent Market.",
    time: times[1],
    views: views[1],
    intro: `
      Put a nice short intro and a hook to hold the reader so that he can read more
    `,
    image2: news2_1,
    content: `
      <b>Bold Text Example</b> /n 
      <f20>Font Size 20 Example</f> /n 
      <c#FF5733>Color Example</c> /n 
      <ce>Centered Text Example</ce> /n 
      <u>Underlined Text Example</u> /n 
      <i>Italic Text Example</i> /n 
      <bc#000000>Background Color Example</bc> /n 
      <ol><li>Ordered List Item 1</li><li>Ordered List Item 2</li></ol> /n 
      <ul><li>Unordered List Item 1</li><li>Unordered List Item 2</li></ul> /n
      <pre>Preformatted Text Example</pre>
    `,
    content_and_conclusion: `
      You talk more about the content here and then conclude here
      and also make sure that you give <b>necessary</b> disclaimer
    `,
  },
  {
    id: "2",
    image: news3,
    title: "Altcoin Season: Top Performing Cryptocurrencies to Watch in 2024",
    time: times[2],
    views: views[2],
    intro: `
      Put a nice short intro and a hook to hold the reader so that he can read more
    `,
    image2: news3_1,
    content: `
      <b>Bold Text Example</b> /n 
      <f20>Font Size 20 Example</f> /n 
      <c#FF5733>Color Example</c> /n 
      <ce>Centered Text Example</ce> /n 
      <u>Underlined Text Example</u> /n 
      <i>Italic Text Example</i> /n 
      <bc#000000>Background Color Example</bc> /n 
      <ol><li>Ordered List Item 1</li><li>Ordered List Item 2</li></ol> /n 
      <ul><li>Unordered List Item 1</li><li>Unordered List Item 2</li></ul> /n
      <pre>Preformatted Text Example</pre>
    `,
    content_and_conclusion: `
      You talk more about the content here and then conclude here
      and also make sure that you give necessary disclaimer
    `,
  },
  {
    id: "3",
    image: news4,
    title: "Binance to Delist Multiple Tokens in July: Check the Delist list",
    time: times[3],
    views: views[3],
    intro: `
      Put a nice short intro and a hook to hold the reader so that he can read more
    `,
    image2: news4_1,
    content: `
      <b>Bold Text Example</b> /n 
      <f20>Font Size 20 Example</f> /n 
      <c#FF5733>Color Example</c> /n 
      <ce>Centered Text Example</ce> /n 
      <u>Underlined Text Example</u> /n 
      <i>Italic Text Example</i> /n 
      <bc#000000>Background Color Example</bc> /n 
      <ol><li>Ordered List Item 1</li><li>Ordered List Item 2</li></ol> /n 
      <ul><li>Unordered List Item 1</li><li>Unordered List Item 2</li></ul> /n
      <pre>Preformatted Text Example</pre>
    `,
    content_and_conclusion: `
      You talk more about the content here and then conclude here
      and also make sure that you give necessary disclaimer
    `,
  },
  {
    id: "4",
    image: news5,
    title: "How to Join the Combat Airdrop: Rules Here",
    time: times[4],
    views: views[4],
    intro: `
      The Combat Airdrop is your chance to earn free cryptocurrency effortlessly.
      By joining the airdrop, you'll receive tokens to your wallet,an 
      opportunity to participate in the growing crypto economy.
    `,
    image2: news5_1,
    content: `
      Welcome to the ultimate guide on joining the Combat Airdrop! 
      Whether you're a seasoned player or a newbie, this guide will walk you 
      through everything you need to know to participate in the action-packed event.
      Follow these rules to ensure you have a smooth and enjoyable experience. /n
      Before you can join the Combat Airdrop, you need to register. Here's how:

      <pre>
      1. Visit the official Combat Airdrop website.
      2. Click on the "Register" button.
      3. Fill in your details accurately, including your ID
      4. Agree to the terms and conditions.
      5. Submit your registration form.
      </pre>
    `,
    content_and_conclusion: `
      On the day of the Combat Airdrop, follow these steps to join the battle:

      <pre>
      1. **Log In Early**: Log in to the game at least 30 minutes before the event starts.
      2. **Join the Lobby**: Navigate to the Combat Airdrop event lobby.
      3. **Wait for Instructions**: Follow any in-game instructions or announcements.
      4. **Battle Time**: Once the airdrop begins, give it your all and aim for victory!
      </pre>   /n
     <b>Conclusion</b>
      Joining the Combat Airdrop is a thrilling experience that requires preparation, strategy,
      and adherence to the rules. By following this guide, you'll be well on your way to participating
      successfully and enjoying the excitement of the event. Good luck, and may the best player win!
    `,
  },
];
