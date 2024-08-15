import news1 from '../assets/news1.png';
import news2 from '../assets/news2.png';
import news3 from '../assets/news3.png';
import news4 from '../assets/news4.png';
import news5 from '../assets/news5.png';
import news1_1 from '../assets/news1_1.png';
import news2_1 from '../assets/news2_1.png';
import news3_1 from '../assets/news3_1.png';
import news4_1 from '../assets/news4_1.png';
import news5_1 from '../assets/news5_1.png';

// Function to generate unique random views
const generateRandomViews = () => {
  const viewsSet = new Set();
  while (viewsSet.size < 5) {
    viewsSet.add(`${Math.floor(Math.random() * (50000 - 10000 + 1) + 10000).toLocaleString()}K`);
  }
  return Array.from(viewsSet);
};

// Function to format hours into a human-readable time string
const formatTime = (hours) => {
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
};

// Function to generate unique random times in ascending order
const generateRandomTimes = () => {
  const timesSet = new Set();
  while (timesSet.size < 5) {
    timesSet.add(Math.floor(Math.random() * 240 + 1)); // Generates a random number between 1 and 240
  }
  return Array.from(timesSet).sort((a, b) => a - b).map(hours => formatTime(hours));
};

const views = generateRandomViews();
const times = generateRandomTimes();

export const news = [
  {
    id: "0",
    image: news1,
    title: "Top 6 Airdrop Projects to Watch This Week",
    time: times[0],
    views: views[0],
    intro: `
      Discover exciting new opportunities in airdrop earning with this week's 
      top projects. We've identified six promising initiatives that could offer significant rewards. 
      These projects span various sectors and provide unique benefits to participants. 
      Keep reading to learn more about each project and what makes them stand out in the first week of July. /n
    `,
    image2: news1_1,
    content: `

      <b>1. Super Champs Airdrop</b> /n /n
      Dive into the exciting world of gaming with Super Champs, a dynamic ecosystem by Joyride Games. Having 
      successfully raised $14 million in a Seed round from big names like Coinbase Ventures, Animoca Brands, 
      Solana Ventures, Dapper, BitKraft, and Mirana Ventures, Super Champs is set to make waves. Their Season 1 
      airdrop campaign, which kicked off on June 25, invites participants to complete tasks on their platform to 
      earn Points. These Points can be converted into CHAMP tokens at the campaign's end, 
      offering a thrilling opportunity for gamers and investors alike. /n /n

      <b>2. Plume Network Airdrop</b> /n /n
      Plume is pioneering the way for real-world assets (RWAs) as the first Layer 2 blockchain in this space. The project has successfully
      raised $10 million from top-tier investors including Galaxy Digital, Superscrypt, Reciprocal, and Portal Ventures. While Plume 
      currently has no token, they are organizing a Testnet program. Users who accumulate points during this phase might be eligible for an
      airdrop when Plume’s token officially launches. This is your chance to be part of an innovative project that bridges the gap between 
      blockchain and real-world assets.

    `,
    content_and_conclusion: `
    
      <b>3. OneFootball Airdrop</b> /n /n
      Football fans, this one's for you! OneFootball, an app beloved by millions of football enthusiasts, recently raised 
      $307 million from investors such as Union Square Ventures, Animoca Brands, Dapper Labs, Adidas, and Liberty City Ventures. 
      In celebration of UEFA Euro, OneFootball is hosting an exciting airdrop program. By completing tasks, participants will earn
      BALLS, which can be exchanged for airdrop tokens in the near future. Stay engaged with your favorite sport and earn rewards 
      along the way! /n /n

      <b>4. HashKey Airdrop</b> /n
      Marking a significant milestone, HashKey has become the first newly licensed cryptocurrency exchange in Hong Kong. The company
      raised $100 million in a Series A round, reaching a pre-money valuation of over $1.2 billion. HashKey has launched an airdrop
      for their $HSK token, which is set to be listed in Q3 2024. To claim $HSK, users simply need to join the DejenDog Telegram bot 
      and complete the designated tasks. This is a golden opportunity for crypto enthusiasts to get in early on a promising new token.
      This week's airdrop opportunities present a diverse range of projects, each with its unique potential and rewards. From the gaming
      innovations of Super Champs to the football fan engagement of OneFootball, and from the pioneering HashKey exchange to the real-world 
      asset integration of Plume Network, these projects offer exciting avenues to explore and earn. Stay informed and proactive to maximize
      these opportunities and make the most out of the evolving crypto landscape. /n /n

      <b>Disclaimer</b> /n /n
      Trading and investing in cryptocurrencies carry a high level of risk and may not be suitable for all investors. The value of 
      cryptocurrencies can fluctuate widely, and participants should be prepared for the possibility of losing their entire investment. 
      It is essential to conduct thorough research and consider your financial situation and risk tolerance before engaging in any 
      cryptocurrency activities, including participating in airdrops. Always seek professional financial advice if you are unsure about 
      the risks involved.
    `,
  },
  {
    id: "1",
    image: news2,
    title: "What Are Meme Coins? Unraveling the Trendy Crypto Phenomenon",
    time: times[1],
    views: views[1],
    intro: `
      Meme coins have taken the crypto world by storm, fueled by internet culture and viral trends. Known for their wild price swings 
      and playful origins, these digital currencies often start as jokes but can quickly gain serious traction through social media and 
      online communities. /n 
      In this article, we'll dive into what meme coins are, explore their rise to fame, 
      and discuss the potential risks that come with investing in these trendy tokens.
    `,
    image2: news2_1,
    content: `
      Memecoins are unique and often humorous segment of the cryptocurrency market, born from internet memes and social media jokes. 
      The pioneer of meme coins, Dogecoin (DOGE), launched in 2013, was inspired by the viral Doge meme featuring a Shiba Inu named Kabosu. /n /n

      These coins are known for their extreme volatility. Driven by online communities and the fear of missing out (FOMO), they can surge 
      in value overnight but also plummet just as quickly when attention shifts to the next trending coin. Another common feature of meme 
      coins is their massive or unlimited supply. For instance, Shiba Inu (SHIB) boasts a total supply of 1 quadrillion tokens, 
      while DOGE has no supply cap. Without mechanisms to burn coins, their abundant supply keeps prices relatively low. /n /n
      <b>Why Are Meme Coins So Popular?</b> /n /n
      During the COVID-19 pandemic, the crypto market saw a boom as retail investors sought inflation hedges. Meme coins rose to fame during 
      this period, paralleling the "meme stock" frenzy with GameStop (GME) and AMC Entertainment (AMC). Inspired by these events, communities 
      on platforms like Reddit jokingly aimed to pump Dogecoin’s price, creating a crypto counterpart to GME. Endorsements from high-profile 
      figures like Elon Musk further propelled DOGE's value. /n /n
      The excitement didn't stop there. Traders soon began exploring other meme coins like Shiba Inu (SHIB), hoping to replicate DOGE's 
      success. Meme coins, often costing just fractions of a cent, allowed traders to own thousands or millions of tokens, providing a 
      different thrill compared to holding small fractions of major cryptocurrencies like ETH or BTC. /n /n

      In 2024, meme coins gained institutional recognition. VanEck's launch of a meme coin index, tracking the top meme coins by market cap, 
      brought meme coins into the limelight, setting a benchmark in asset management. The inclusion of meme coin tickers on major platforms 
      like Bloomberg further increased their visibility and trading activity.


    `,
    content_and_conclusion: `
        <b>What Do Meme Coins Mean for the Crypto Community?</b> /n /n
        Many meme coins, like Dogecoin (DOGE), were launched with fair distribution models, making them accessible to the public without 
        significant premining or early allocations to founders. This resonates with the crypto community's values of decentralization and 
        community-driven growth, fostering a sense of ownership and participation. /n /n

        However, not all meme coins follow these principles. Some are premined, allocating a large portion of tokens to creators or early 
        investors, raising concerns about transparency and fairness. This centralization can lead to potential manipulation and unfair 
        practices, drawing mixed reactions from the community. /n /n

        <b>How to Reduce Risks When Investing in Meme Coins</b> /n /n
        Investing in meme coins is highly speculative and comes with significant risks. Here are some strategies to mitigate these risks: /n /n

        1.Do Your Own Research (DYOR): Thoroughly investigate the project's team, goals, whitepaper, roadmap, and community sentiment 
          before investing. /n /n

        2.Understand the Tokenomics: Pay attention to the supply dynamics and any mechanisms like burning or staking that could affect
          the coin's long-term viability. /n /n

        3.Diversify Your Portfolio: Spread your investments across various assets to reduce risk, including more established 
          cryptocurrencies like BTC, ETH, SOL, and BNB. /n /n

        4.Stay Informed: Keep up with the latest news and trends in the crypto world to make informed decisions. /n /n

        5.Set Stop-Loss Orders: Use stop-loss orders to automatically sell your meme coins if their price drops below a certain level, 
          protecting against significant losses. /n /n

        6.Avoid Impulsive Decisions: Only invest what you can afford to lose and avoid making decisions based on hype and FOMO. 
          Take a step back to evaluate investments logically. /n /n

          By following these guidelines and maintaining a healthy level of skepticism, you can navigate the meme coin landscape more safely 
          and avoid potential scams. Remember, investing in cryptocurrencies, especially meme coins, carries significant risk, so only invest 
          what you can afford to lose.
    `,
  },
  {
    id: "2",
    image: news3,
    title: "How to Join the XION Airdrop: A Quick Guide",
    time: times[2],
    views: views[2],
    intro: `
      XION, a cutting-edge Layer 1 blockchain, has raised a staggering $36 million from top-tier investment funds and is now launching its 
      testnet program. By participating in the testnet, you get a shot at the exciting XION Airdrop. Don’t miss out on this opportunity to 
      be part of the next big thing in blockchain technology!/n
    `,
    image2: news3_1,
    content: `
      XION is a game-changer in the blockchain world, designed to bring crypto to the masses with its user-friendly, consumer-focused 
      approach. As the first crypto-abstracted Layer 1 blockchain built for widespread adoption, XION aims to reach billions of 
      non-technical users. Its innovative features include: /n /n

      1. MPC security. /n 
      2. Seamless email login. /n
      3. Mobile support. /n
      4. Lightning-fast, gasless transactions. /n
      5. Native on & off ramps. /n
      6. Global direct credit/debit card purchasing. /n
      7. Fiat denomination. /n
      8. Native interoperability with over 50 other networks. /n /n

      Backed by the powerhouse development team Burnt, XION has secured $36 million in funding from investors like Animoca, Multicoin, 
      and Circle. They've now launched a testnet where users can earn XP by completing simple tasks. While XION currently doesn't have 
      its own token, early testnet participants might receive an airdrop if a token is launched in the future. /n /n

    <b>How to Participate in the XION Airdrop</b> /n /n
     <b>Step 1:</b> Head over to the <link="https://xion.bonusblock.io?r=hR6Zras5">XION website</link> and connect using your email. /n

     <b>Step 2:</b> Sign up with your email to create a new account. /n

     <b>Step 3:</b> Connect your social media profiles to your XION account. /n


     <b>Step 4:</b> Participate in various tasks on the XION platform to earn XP. /n

     <b>Step 5:</b> Mint your free Welcome NFT and repeat the process every 24 hours to maximize your rewards. /n
    `,
    content_and_conclusion: `
      Stay ahead of the curve and be part of XION's revolutionary journey. Join the testnet now and position yourself for potential 
      future rewards!
    `,
  },
  {
    id: "3",
    image: news4,
    title: "Dollar Cost Averaging: The Savvy Investor's Secret Weapon",
    time: times[3],
    views: views[3],
    intro: `
      Dollar Cost Averaging (DCA) is a smart and steady investment strategy that takes the guesswork out of timing the market. Instead of 
      stressing over the perfect moment to invest, DCA allows you to invest a fixed amount at regular intervals, spreading your purchases 
      over time. /n /n
      This method not only reduces the impact of market volatility but also makes investing more accessible and less intimidating. /n /n
      In this article, we'll break down how DCA works, why it's a favorite among seasoned investors, and how you can start using it to build 
      your own investment portfolio with confidence. /n
    `,
    image2: news4_1,
    content: `
      The term "dollar cost averaging" comes from the potential to lower the average cost of your investments. By investing consistently 
      over time, you buy fewer units when prices are high and more when prices are low, gradually building your position rather than making 
      a single, potentially risky purchase. /n /n

      <b>Let's Dive Into a DCA Example:</b> /n /n
      On March 11 2023, Sonia and Greg both decide to invest in Bitcoin, but with different strategies. /n /n

      <b>Greg's Approach:</b> /n /n
      Greg decides to invest $5000 in Bitcoin every week until he accumulates one whole BTC.
      By investing $5000 each week, Greg gradually accumulates one BTC at a total cost of $50,000, taking advantage of the price fluctuations 
      over time. /n /n

      <b>Sonia's Approach:</b> /n
      Sonia opts to buy one whole Bitcoin in a single purchase. /n

      Sonia buys one BTC on January 1st for a total cost of $60,386. Unlike Greg, she misses the chance to benefit from potential price 
      drops since she invested all at once. /n
    `,
    content_and_conclusion: `
      This example clearly illustrates the advantage of DCA. Greg managed to acquire his Bitcoin at a lower average cost compared to Sonia, 
      who paid significantly more by making a single purchase.

      DCA is a powerful strategy for those looking to mitigate risk and avoid the pitfalls of market timing. By spreading out your 
      investments, you can build a strong portfolio with greater confidence and less stress.
    `,
  },
  {
    id: "4",
    image: news5,
    title: "Grab Free DOGS Airdrop on Telegram!",
    time: times[4],
    views: views[4],
    intro: `
      DOGS, a trending memecoin on Telegram, is offering an exciting airdrop that you won’t want to miss! Projects on Telegram are becoming 
      popular for rewarding users generously, and DOGS is no exception. /n /n
      Inspired by Spotty, a dog drawn by Telegram CEO Pavel Durov during a 
      2011 charity auction, DOGS not only brings fun but also commits to donating 100% of the revenue from Spotty-themed memorabilia to 
      support orphans and homeless children.
    `,
    image2: news5_1,
    content: `
      <b>Here's how you can get your free DOGS airdrop:</b> /n /n

      1. Click the <link="https://t.me/dogshouse_bot/join?startapp=qLPLtwg3RBChTNjludFAqg">Link: Open the app on Telegram</link>. /n
      2. Wait for Analysis: Your profile will be analyzed. /n
      3. Receive DOGS Tokens: After the analysis, you’ll receive DOGS tokens. The older your account, the more tokens you’ll get. /n
      4. Invite Friends: Open the Friends tab and invite your friends to earn additional tokens.
    `,
    content_and_conclusion: `
      Join now to seize the opportunity to own DOGS tokens and contribute to meaningful charitable activities! /n /n

      Joining the Airdrop is a thrilling experience that requires preparation, strategy,
      and adherence to the rules. By following this guide, you'll be well on your way to participating
      successfully and enjoying the excitement of the event. Good luck, and may the best player win!
    `,
  },
];
