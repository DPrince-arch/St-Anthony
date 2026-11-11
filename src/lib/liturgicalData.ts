import { DailyLiturgicalReadings, LiturgicalColor } from './types';

// Color mapping to aesthetic liturgical hues
export const LITURGICAL_COLORS: Record<LiturgicalColor, { name: string; bg: string; text: string; hex: string }> = {
  green: { name: 'Green', bg: 'bg-emerald-700', text: 'text-emerald-100', hex: '#047857' },
  violet: { name: 'Violet', bg: 'bg-purple-800', text: 'text-purple-100', hex: '#6b21a8' },
  white: { name: 'White / Gold', bg: 'bg-amber-600', text: 'text-amber-50', hex: '#d97706' },
  red: { name: 'Red', bg: 'bg-rose-700', text: 'text-rose-100', hex: '#be123c' },
  rose: { name: 'Rose', bg: 'bg-pink-600', text: 'text-pink-100', hex: '#db2777' }
};

// Known Feasts & Solemnities
const KNOWN_FEASTS: Record<string, { title: string; color: LiturgicalColor; rank: DailyLiturgicalReadings['rank']; saint?: string; summary?: string }> = {
  "01-01": { title: "Solemnity of Mary, The Holy Mother of God", color: "white", rank: "Solemnity", saint: "Blessed Virgin Mary" },
  "01-06": { title: "The Epiphany of the Lord", color: "white", rank: "Solemnity" },
  "03-19": { title: "Solemnity of St. Joseph, Spouse of the Blessed Virgin Mary", color: "white", rank: "Solemnity", saint: "St. Joseph" },
  "03-25": { title: "The Annunciation of the Lord", color: "white", rank: "Solemnity" },
  "06-13": { title: "Solemnity of Saint Anthony of Padua, Priest and Doctor (Parish Patron)", color: "white", rank: "Solemnity", saint: "St. Anthony of Padua", summary: "Patron saint of lost things, the poor, and miracles. Known for his powerful preaching and love for the Infant Jesus." },
  "06-24": { title: "The Nativity of Saint John the Baptist", color: "white", rank: "Solemnity", saint: "St. John the Baptist" },
  "06-29": { title: "Saints Peter and Paul, Apostles", color: "red", rank: "Solemnity", saint: "Sts. Peter & Paul" },
  "08-15": { title: "The Assumption of the Blessed Virgin Mary", color: "white", rank: "Solemnity", saint: "Blessed Virgin Mary" },
  "09-29": { title: "Saints Michael, Gabriel, and Raphael, Archangels", color: "white", rank: "Feast", saint: "Holy Archangels" },
  "10-01": { title: "Saint Thérèse of the Child Jesus, Virgin and Doctor", color: "white", rank: "Memorial", saint: "St. Thérèse of Lisieux" },
  "10-04": { title: "Saint Francis of Assisi", color: "white", rank: "Memorial", saint: "St. Francis of Assisi" },
  "11-01": { title: "Solemnity of All Saints", color: "white", rank: "Solemnity" },
  "11-02": { title: "The Commemoration of All the Faithful Departed (All Souls' Day)", color: "violet", rank: "Feast" },
  "12-08": { title: "The Immaculate Conception of the Blessed Virgin Mary", color: "white", rank: "Solemnity", saint: "Blessed Virgin Mary" },
  "12-25": { title: "The Nativity of the Lord (Christmas Day)", color: "white", rank: "Solemnity" },
  "12-26": { title: "Saint Stephen, The First Martyr", color: "red", rank: "Feast", saint: "St. Stephen" }
};

// Rich curated daily scripture lectionary sets
const LECTIONARY_CYCLES = [
  {
    firstReading: {
      citation: "Wisdom 6:12-16",
      text: "Resplendent and unfading is wisdom, and she is readily perceived by those who love her, and found by those who seek her. She hastens to make herself known in anticipation of their desire; whoever watches for her at dawn shall not be disappointed, for he shall find her sitting by his gate. For taking thought of wisdom is the perfection of prudence, and whoever for her sake keeps vigil shall quickly be free from care; because she goes about seeking those worthy of her, and she graciously appears to them in the ways and meets them with all solicitude."
    },
    psalm: {
      citation: "Psalm 63:2, 3-4, 5-6, 7-8",
      response: "My soul is thirsting for you, O Lord my God.",
      verses: [
        "O God, you are my God whom I seek; for you my flesh pines and my soul thirsts like the earth, parched, lifeless and without water.",
        "Thus have I gazed toward you in the sanctuary to see your power and your glory, for your kindness is a greater good than life; my lips shall glorify you.",
        "Thus will I bless you while I live; lifting up my hands, I will call upon your name. As with the riches of a banquet shall my soul be satisfied, and with exultant lips my mouth shall praise you.",
        "You are my help, and in the shadow of your wings I shout for joy. My soul clings fast to you; your right hand upholds me."
      ]
    },
    secondReading: {
      citation: "1 Thessalonians 4:13-18",
      text: "We do not want you to be unaware, brothers and sisters, about those who have fallen asleep, so that you may not grieve like the rest, who have no hope. For if we believe that Jesus died and rose, so too will God, through Jesus, bring with him those who have fallen asleep. Indeed, we tell you this, on the word of the Lord, that we who are alive, who are left until the coming of the Lord, will surely not precede those who have fallen asleep. Therefore, console one another with these words."
    },
    gospelAcclamation: {
      verse: "Stay awake and be ready! For you do not know on what day your Lord will come."
    },
    gospel: {
      citation: "Matthew 25:1-13",
      text: "Jesus told his disciples this parable: 'The kingdom of heaven will be like ten virgins who took their lamps and went out to meet the bridegroom. Five of them were foolish and five were wise. The foolish ones, when taking their lamps, brought no oil with them, but the wise brought flasks of oil with their lamps. Since the bridegroom was long delayed, they all became drowsy and fell asleep. At midnight, there was a cry: \"Behold, the bridegroom! Come out to meet him!\" Then all those virgins got up and trimmed their lamps. The foolish ones said to the wise, \"Give us some of your oil, for our lamps are going out.\" But the wise ones replied, \"No, for there may not be enough for us and you. Go instead to the merchants and buy some for yourselves.\" While they went off to buy it, the bridegroom came and those who were ready went into the wedding feast with him. Then the door was locked. Afterwards the other virgins came and said, \"Lord, Lord, open the door for us!\" But he said in reply, \"Amen, I say to you, I do not know you.\" Therefore, stay awake, for you know neither the day nor the hour.'"
    },
    reflection: "The wise virgins were prepared not simply with torches, but with oil — the persistent grace of a life rooted in faith, prayer, and charitable works. Today, Christ invites us to examine our lamps: are we living with hearts open and attentive to His voice?"
  },
  {
    firstReading: {
      citation: "Isaiah 55:10-11",
      text: "Thus says the Lord: Just as from the heavens the rain and snow come down and do not return there till they have watered the earth, making it fertile and fruitful, giving seed to the one who sows and bread to the one who eats, so shall my word be that goes forth from my mouth; my word shall not return to me void, but shall do my will, achieving the end for which I sent it."
    },
    psalm: {
      citation: "Psalm 34:4-5, 6-7, 16-17, 18-19",
      response: "From all their afflictions God will deliver the just.",
      verses: [
        "Glorify the Lord with me, let us together extol his name. I sought the Lord, and he answered me and delivered me from all my fears.",
        "Look to him that you may be radiant with joy, and your faces may not blush with shame. When the poor one called out, the Lord heard, and from all his distress he saved him.",
        "The Lord has eyes for the just, and ears for their cry. The Lord confronts the evildoers, to destroy remembrance of them from the earth.",
        "When the just cry out, the Lord hears them, and from all their distress he rescues them. The Lord is close to the brokenhearted; and those who are crushed in spirit he saves."
      ]
    },
    secondReading: {
      citation: "Romans 8:18-23",
      text: "Brothers and sisters: I consider that the sufferings of this present time are as nothing compared with the glory to be revealed for us. For creation awaits with eager expectation the revelation of the children of God; for creation was subjected to futility, not of its own accord but because of the one who subjected it, in hope that creation itself would be set free from slavery to corruption and share in the glorious freedom of the children of God."
    },
    gospelAcclamation: {
      verse: "The seed is the word of God, Christ is the sower. All who come to him will live for ever."
    },
    gospel: {
      citation: "Matthew 13:1-9",
      text: "On that day, Jesus went out of the house and sat down by the sea. Such large crowds gathered around him that he got into a boat and sat down, and the whole crowd stood along the shore. And he spoke to them at length in parables, saying: 'A sower went out to sow. And as he sowed, some seed fell on the path, and birds came and ate it up. Some fell on rocky ground, where it had little soil. It sprang up at once because the soil was not deep, and when the sun rose it was scorched, and it withered for lack of roots. Some seed fell among thorns, and the thorns grew up and choked it. But some seed fell on rich soil, and produced fruit, a hundred or sixty or thirtyfold. Whoever has ears ought to hear.'"
    },
    reflection: "God's word possesses infinite divine power to transform, yet it waits reverently upon the soil of our human hearts. What stones of distraction or thorns of worldly anxieties can we surrender to Jesus today?"
  },
  {
    firstReading: {
      citation: "Philippians 4:6-9",
      text: "Brothers and sisters: Have no anxiety at all, but in everything, by prayer and petition, with thanksgiving, make your requests known to God. Then the peace of God that surpasses all understanding will guard your hearts and minds in Christ Jesus. Finally, brothers and sisters, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is gracious, if there is any excellence and if there is anything worthy of praise, think about these things. Keep on doing what you have learned and received and heard and seen in me. Then the God of peace will be with you."
    },
    psalm: {
      citation: "Psalm 80:9, 12, 13-14, 15-16, 19-20",
      response: "The vineyard of the Lord is the house of Israel.",
      verses: [
        "A vine from Egypt you transplanted; you drove away the nations and planted it. It put forth its foliage to the Sea, its shoots as far as the River.",
        "Why have you broken down its walls, so that every passer-by plucks its fruit, the boar from the forest lays it waste, and the beasts of the field feed upon it?",
        "Once again, O Lord of hosts, look down from heaven, and see; take care of this vine, and protect what your right hand has planted.",
        "Then we will no more withdraw from you; give us new life, and we will call upon your name. O Lord, God of hosts, restore us; if your face shine upon us, then we shall be saved."
      ]
    },
    secondReading: {
      citation: "Ephesians 2:19-22",
      text: "So then you are no longer strangers and sojourners, but you are fellow citizens with the holy ones and members of the household of God, built upon the foundation of the apostles and prophets, with Christ Jesus himself as the capstone."
    },
    gospelAcclamation: {
      verse: "I have chosen you from the world, says the Lord, to go and bear fruit that will remain."
    },
    gospel: {
      citation: "John 15:1-8",
      text: "Jesus said to his disciples: 'I am the true vine, and my Father is the vine grower. He takes away every branch in me that does not bear fruit, and everyone that does he prunes so that it bears more fruit. You are already pruned because of the word that I spoke to you. Remain in me, as I remain in you. Just as a branch cannot bear fruit on its own unless it remains on the vine, so neither can you unless you remain in me. I am the vine, you are the branches. Whoever remains in me and I in him will bear much fruit, because without me you can do nothing.'"
    },
    reflection: "Without Me, you can do nothing. Our spiritual vitality, peace of heart, and fruitfulness in family and church life all spring from staying grafted into Christ through the Sacraments and prayer."
  },
  {
    firstReading: {
      citation: "1 Kings 19:9a, 11-13a",
      text: "At the mountain of God, Horeb, Elijah came to a cave where he took shelter. Then the Lord said to him: 'Go outside and stand on the mountain before the Lord; the Lord will be passing by.' A strong and heavy wind was rending the mountains and crushing rocks before the Lord—but the Lord was not in the wind. After the wind there was an earthquake—but the Lord was not in the earthquake. After the earthquake there was fire—but the Lord was not in the fire. After the fire there was a tiny whispering sound. When he heard this, Elijah hid his face in his cloak and went and stood at the entrance of the cave."
    },
    psalm: {
      citation: "Psalm 85:9, 10, 11-12, 13-14",
      response: "Lord, let us see your kindness, and grant us your salvation.",
      verses: [
        "I will hear what God proclaims; the Lord—for he proclaims peace to his people. Near indeed is his salvation to those who fear him, glory dwelling in our land.",
        "Kindness and truth shall meet; justice and peace shall kiss. Truth shall spring out of the earth, and justice shall look down from heaven.",
        "The Lord himself will give his benefits; our land shall yield its increase. Justice shall walk before him, and prepare the way of his steps."
      ]
    },
    secondReading: {
      citation: "Romans 9:1-5",
      text: "Brothers and sisters: I speak the truth in Christ, I do not lie; my conscience joins with the Holy Spirit in bearing me witness that I have great sorrow and constant anguish in my heart. For I could wish that I myself were accursed and cut off from Christ for the sake of my own people, my kindred according to the flesh."
    },
    gospelAcclamation: {
      verse: "I wait for the Lord, my soul waits for his word."
    },
    gospel: {
      citation: "Matthew 14:22-33",
      text: "After he had fed the people, Jesus made the disciples get into a boat and precede him to the other side, while he dismissed the crowds. After doing so, he went up on the mountain by himself to pray. When it was evening he was there alone. Meanwhile the boat, already a few miles offshore, was being tossed about by the waves, for the wind was against it. During the fourth watch of the night, he came toward them walking on the sea. When the disciples saw him walking on the sea they were terrified. 'It is a ghost,' they said, and they cried out in fear. At once Jesus spoke to them, 'Take courage, it is I; do not be afraid.' Peter said to him in reply, 'Lord, if it is you, command me to come to you on the water.' He said, 'Come.' Peter got out of the boat and began to walk on the water toward Jesus. But when he saw how strong the wind was he became frightened; and, beginning to sink, he cried out, 'Lord, save me!' Immediately Jesus stretched out his hand and caught him, and said to him, 'O you of little faith, why did you doubt?'"
    },
    reflection: "When the storms of life toss our little boats, Christ walks upon the waters toward us. Like Peter, as long as our eyes remain fixed on Jesus, we stand firm; the moment we look only at the waves, we sink. Cry out to Him in prayer: 'Lord, save me!'"
  }
];

export function getLiturgicalReadingsForDate(dateStr?: string): DailyLiturgicalReadings {
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const dayOfWeekIndex = targetDate.getDay(); // 0 is Sunday, 6 is Saturday
  
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = daysOfWeek[dayOfWeekIndex];
  
  const monthDay = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Check known fixed solemnities / feast
  const knownFeast = KNOWN_FEASTS[monthDay];

  // Determine Liturgical Season & Default Color
  let season: DailyLiturgicalReadings['season'] = 'Ordinary Time';
  let color: LiturgicalColor = 'green';
  let rank: DailyLiturgicalReadings['rank'] = dayOfWeekIndex === 0 ? 'Solemnity' : 'Weekday';
  let celebrationTitle = `${dayOfWeek} of the ${Math.min(34, Math.max(1, Math.floor(day / 7) + (month > 6 ? (month - 5) * 4 : month * 4)))}th Week in Ordinary Time`;

  // Seasonal checks
  if (month === 12 && day < 25) {
    season = 'Advent';
    color = 'violet';
    celebrationTitle = `${dayOfWeek} of Advent`;
  } else if ((month === 12 && day >= 25) || (month === 1 && day <= 12)) {
    season = 'Christmas';
    color = 'white';
    celebrationTitle = `${dayOfWeek} of Christmastide`;
  } else if ((month === 2 && day >= 15) || month === 3 || (month === 4 && day <= 15)) {
    season = 'Lent';
    color = 'violet';
    celebrationTitle = `${dayOfWeek} of Lent`;
  } else if ((month === 4 && day > 15) || month === 5) {
    season = 'Easter';
    color = 'white';
    celebrationTitle = `${dayOfWeek} of Eastertide`;
  }

  // Override if known solemnity/feast
  if (knownFeast) {
    celebrationTitle = knownFeast.title;
    color = knownFeast.color;
    rank = knownFeast.rank;
  }

  // Pick lectionary cycle based on date hash
  const dayHash = (year * 372 + month * 31 + day) % LECTIONARY_CYCLES.length;
  const cycle = LECTIONARY_CYCLES[dayHash];

  // If Sunday or Solemnity, include second reading
  const isSundayOrSolemnity = dayOfWeekIndex === 0 || rank === 'Solemnity' || rank === 'Feast';

  return {
    date: isoDate,
    dayOfWeek,
    celebrationTitle,
    season,
    color,
    colorHex: LITURGICAL_COLORS[color].hex,
    rank,
    saintOfTheDay: knownFeast?.saint || (dayOfWeekIndex === 6 ? "Memorial of the Blessed Virgin Mary" : "St. Anthony of Padua & Holy Angels"),
    saintSummary: knownFeast?.summary,
    readings: {
      firstReading: cycle.firstReading,
      psalm: cycle.psalm,
      secondReading: isSundayOrSolemnity ? cycle.secondReading : undefined,
      gospelAcclamation: cycle.gospelAcclamation,
      gospel: cycle.gospel
    },
    dailyReflection: {
      author: "Fr. Emmanuel Anthony (Parish Priest)",
      text: cycle.reflection
    }
  };
}
