import { Prayer } from './types';

export const PRAYERS: Prayer[] = [
  {
    id: "holy-rosary",
    title: "The Most Holy Rosary",
    category: "rosary",
    subtitle: "Contemplative Marian devotion on the life, death, and resurrection of Christ",
    description: "The Rosary is a Scripture-based prayer that leads us through the mysteries of our salvation. It consists of opening prayers, followed by five decades (1 Our Father, 10 Hail Marys, 1 Glory Be, 1 Fatima Prayer per decade), and concludes with the Hail Holy Queen.",
    mysteries: [
      {
        name: "Joyful Mysteries",
        days: ["Monday", "Saturday"],
        decades: [
          { number: 1, title: "The Annunciation", scripture: "The angel Gabriel said to Mary: 'Hail, full of grace! The Lord is with you... You will conceive in your womb and bear a son, and you shall name him Jesus.' (Luke 1:28,31)", fruit: "Humility" },
          { number: 2, title: "The Visitation", scripture: "When Elizabeth heard Mary's greeting, the infant leaped in her womb, and Elizabeth, filled with the Holy Spirit, cried out in a loud voice and said: 'Blessed are you among women, and blessed is the fruit of your womb.' (Luke 1:41-42)", fruit: "Love of Neighbor" },
          { number: 3, title: "The Nativity", scripture: "And she gave birth to her firstborn son and wrapped him in swaddling clothes and laid him in a manger, because there was no room for them in the inn. (Luke 2:7)", fruit: "Poverty of Spirit" },
          { number: 4, title: "The Presentation in the Temple", scripture: "When the days were completed for their purification according to the law of Moses, Mary and Joseph took Jesus up to Jerusalem to present him to the Lord. (Luke 2:22)", fruit: "Obedience" },
          { number: 5, title: "Finding of the Child Jesus in the Temple", scripture: "After three days they found him in the temple, sitting in the midst of the teachers, listening to them and asking them questions. (Luke 2:46)", fruit: "Joy in finding Jesus" }
        ]
      },
      {
        name: "Luminous Mysteries (Mysteries of Light)",
        days: ["Thursday"],
        decades: [
          { number: 1, title: "The Baptism of the Lord in the Jordan", scripture: "And a voice came from heaven, 'You are my beloved Son; with you I am well pleased.' (Mark 1:11)", fruit: "Openness to the Holy Spirit" },
          { number: 2, title: "The Wedding at Cana", scripture: "His mother said to the servers, 'Do whatever he tells you.' Jesus said to them, 'Fill the jars with water.' And they filled them to the brim. (John 2:5,7)", fruit: "To Jesus through Mary" },
          { number: 3, title: "The Proclamation of the Kingdom", scripture: "'This is the time of fulfillment. The kingdom of God is at hand. Repent, and believe in the gospel.' (Mark 1:15)", fruit: "Repentance and Trust in God" },
          { number: 4, title: "The Transfiguration", scripture: "And he was transfigured before them; his face shone like the sun and his clothes became white as light. (Matthew 17:2)", fruit: "Desire for Holiness" },
          { number: 5, title: "The Institution of the Holy Eucharist", scripture: "While they were eating, Jesus took bread, said the blessing, broke it, and giving it to his disciples, said: 'Take and eat; this is my body.' (Matthew 26:26)", fruit: "Eucharistic Adoration" }
        ]
      },
      {
        name: "Sorrowful Mysteries",
        days: ["Tuesday", "Friday"],
        decades: [
          { number: 1, title: "The Agony in the Garden", scripture: "In his anguish he prayed with all the greater intensity, and his sweat became like drops of blood falling to the ground. (Luke 22:44)", fruit: "Sorrow for Sin" },
          { number: 2, title: "The Scourging at the Pillar", scripture: "Then Pilate took Jesus and had him scourged. (John 19:1)", fruit: "Purity and Mortification" },
          { number: 3, title: "The Crowning with Thorns", scripture: "And the soldiers wove a crown out of thorns and placed it on his head, and clothed him in a purple cloak. (John 19:2)", fruit: "Moral Courage" },
          { number: 4, title: "The Carrying of the Cross", scripture: "And carrying the cross himself he went out to what is called the Place of the Skull, in Hebrew, Golgotha. (John 19:17)", fruit: "Patience in Trials" },
          { number: 5, title: "The Crucifixion and Death of Our Lord", scripture: "Jesus cried out in a loud voice, 'Father, into your hands I commend my spirit'; and when he had said this he breathed his last. (Luke 23:46)", fruit: "Self-Giving Love & Forgiveness" }
        ]
      },
      {
        name: "Glorious Mysteries",
        days: ["Wednesday", "Sunday"],
        decades: [
          { number: 1, title: "The Resurrection of Jesus Christ", scripture: "'Do not be amazed! You seek Jesus of Nazareth, the crucified. He has been raised; he is not here.' (Mark 16:6)", fruit: "Faith" },
          { number: 2, title: "The Ascension of Our Lord into Heaven", scripture: "As they were looking on, he was lifted up, and a cloud took him from their sight. (Acts 1:9)", fruit: "Christian Hope" },
          { number: 3, title: "The Descent of the Holy Spirit (Pentecost)", scripture: "And there appeared to them tongues as of fire, which parted and came to rest on each one of them. And they were all filled with the Holy Spirit. (Acts 2:3-4)", fruit: "Love of God and Zeal" },
          { number: 4, title: "The Assumption of the Blessed Virgin Mary", scripture: "A great sign appeared in the sky, a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars. (Revelation 12:1)", fruit: "Grace of a Happy Death" },
          { number: 5, title: "The Coronation of Mary as Queen of Heaven and Earth", scripture: "'Blessed are you, daughter, by the Most High God, above all the women on earth.' (Judith 13:18)", fruit: "Trust in Mary's Intercession" }
        ]
      }
    ]
  },
  {
    id: "litany-of-saints",
    title: "The Litany of the Saints",
    category: "litany",
    subtitle: "Ancient solemn prayer invoking the communion of saints",
    description: "One of the oldest liturgical litanies of the Catholic Church, chanted during the Easter Vigil, Ordinations, and major solemnities.",
    verses: [
      { call: "Lord, have mercy on us.", response: "Lord, have mercy on us." },
      { call: "Christ, have mercy on us.", response: "Christ, have mercy on us." },
      { call: "Lord, have mercy on us.", response: "Lord, have mercy on us." },
      { call: "Christ, hear us.", response: "Christ, graciously hear us." },
      { call: "God the Father of heaven,", response: "Have mercy on us." },
      { call: "God the Son, Redeemer of the world,", response: "Have mercy on us." },
      { call: "God the Holy Spirit,", response: "Have mercy on us." },
      { call: "Holy Trinity, one God,", response: "Have mercy on us." },
      { call: "Holy Mary, Mother of God,", response: "Pray for us." },
      { call: "Saint Michael, Gabriel, and Raphael,", response: "Pray for us." },
      { call: "All holy Angels and Archangels,", response: "Pray for us." },
      { call: "Saint John the Baptist,", response: "Pray for us." },
      { call: "Saint Joseph, Patron of the Universal Church,", response: "Pray for us." },
      { call: "All holy Patriarchs and Prophets,", response: "Pray for us." },
      { call: "Saint Peter and Saint Paul,", response: "Pray for us." },
      { call: "Saint Andrew, James, and John,", response: "Pray for us." },
      { call: "All holy Apostles and Evangelists,", response: "Pray for us." },
      { call: "Saint Stephen and Saint Lawrence,", response: "Pray for us." },
      { call: "Saint Cyprian and Saint Ignatius of Antioch,", response: "Pray for us." },
      { call: "All holy Martyrs of Christ,", response: "Pray for us." },
      { call: "Saint Anthony of Padua, our Parish Patron,", response: "Pray for us." },
      { call: "Saint Benedict, Dominic, and Francis,", response: "Pray for us." },
      { call: "Saint Thomas Aquinas and Saint Augustine,", response: "Pray for us." },
      { call: "Saint Mary Magdalene,", response: "Pray for us." },
      { call: "Saint Agnes, Cecilia, and Catherine,", response: "Pray for us." },
      { call: "Saint Teresa of Jesus and Saint Thérèse of Lisieux,", response: "Pray for us." },
      { call: "All holy men and women, Saints of God,", response: "Intercede for us." },
      { call: "Lord, be merciful,", response: "Lord, deliver your people." },
      { call: "From all evil and sin,", response: "Lord, deliver your people." },
      { call: "From everlasting death,", response: "Lord, deliver your people." },
      { call: "By your Incarnation, Passion, and Cross,", response: "Lord, deliver your people." },
      { call: "By your glorious Resurrection and Ascension,", response: "Lord, deliver your people." },
      { call: "By the outpouring of the Holy Spirit,", response: "Lord, deliver your people." },
      { call: "Be merciful to us sinners,", response: "Lord, we ask you, hear our prayer." },
      { call: "Govern and protect your holy Church,", response: "Lord, we ask you, hear our prayer." },
      { call: "Keep the Pope and all the clergy in true religion,", response: "Lord, we ask you, hear our prayer." },
      { call: "Bless our parish family of St. Anthony,", response: "Lord, we ask you, hear our prayer." },
      { call: "Christ, hear us.", response: "Christ, hear us." },
      { call: "Christ, graciously hear us.", response: "Christ, graciously hear us." }
    ]
  },
  {
    id: "litany-of-st-anthony",
    title: "Litany of Saint Anthony of Padua",
    category: "litany",
    subtitle: "Patron Saint of St. Anthony Catholic Church",
    description: "Invocations honoring our glorious parish patron, St. Anthony, celebrated for his charity to the poor, powerful intercession, and love for Christ.",
    verses: [
      { call: "Lord, have mercy on us.", response: "Christ, have mercy on us." },
      { call: "Christ, hear us.", response: "Christ, graciously hear us." },
      { call: "Saint Anthony of Padua,", response: "Pray for us." },
      { call: "Saint Anthony, glory of the Order of Friars Minor,", response: "Pray for us." },
      { call: "Saint Anthony, ark of the testament,", response: "Pray for us." },
      { call: "Saint Anthony, sanctuary of heavenly wisdom,", response: "Pray for us." },
      { call: "Saint Anthony, destroyer of worldly vanity,", response: "Pray for us." },
      { call: "Saint Anthony, conqueror of concupiscence,", response: "Pray for us." },
      { call: "Saint Anthony, mirror of obedience,", response: "Pray for us." },
      { call: "Saint Anthony, pearl of holy poverty,", response: "Pray for us." },
      { call: "Saint Anthony, lily of heavenly purity,", response: "Pray for us." },
      { call: "Saint Anthony, model of humility,", response: "Pray for us." },
      { call: "Saint Anthony, fervent lover of the Cross,", response: "Pray for us." },
      { call: "Saint Anthony, martyr in desire,", response: "Pray for us." },
      { call: "Saint Anthony, pillar of the Church,", response: "Pray for us." },
      { call: "Saint Anthony, zealous apostle of souls,", response: "Pray for us." },
      { call: "Saint Anthony, teacher of divine truth,", response: "Pray for us." },
      { call: "Saint Anthony, hammer of heretics,", response: "Pray for us." },
      { call: "Saint Anthony, consoler of the afflicted,", response: "Pray for us." },
      { call: "Saint Anthony, helper in all our necessities,", response: "Pray for us." },
      { call: "Saint Anthony, restorer of lost things,", response: "Pray for us." },
      { call: "Saint Anthony, who bore the Infant Jesus in your arms,", response: "Pray for us." },
      { call: "Lamb of God, who takes away the sins of the world,", response: "Spare us, O Lord." },
      { call: "Lamb of God, who takes away the sins of the world,", response: "Graciously hear us, O Lord." },
      { call: "Lamb of God, who takes away the sins of the world,", response: "Have mercy on us." },
      { call: "Pray for us, blessed Anthony,", response: "That we may be made worthy of the promises of Christ." }
    ]
  },
  {
    id: "litany-of-loreto",
    title: "Litany of Loreto (Blessed Virgin Mary)",
    category: "litany",
    subtitle: "Poetic and doctrinal titles of Our Lady",
    description: "Approved by Pope Sixtus V in 1587, this beloved litany praises Mary's virtues and her role in salvation history.",
    verses: [
      { call: "Holy Mary,", response: "Pray for us." },
      { call: "Holy Mother of God,", response: "Pray for us." },
      { call: "Holy Virgin of virgins,", response: "Pray for us." },
      { call: "Mother of Christ,", response: "Pray for us." },
      { call: "Mother of the Church,", response: "Pray for us." },
      { call: "Mother of Mercy,", response: "Pray for us." },
      { call: "Mother of divine grace,", response: "Pray for us." },
      { call: "Mother of Hope,", response: "Pray for us." },
      { call: "Mother most pure,", response: "Pray for us." },
      { call: "Mother most chaste,", response: "Pray for us." },
      { call: "Mother inviolate,", response: "Pray for us." },
      { call: "Mother undefiled,", response: "Pray for us." },
      { call: "Mother most amiable,", response: "Pray for us." },
      { call: "Mother admirable,", response: "Pray for us." },
      { call: "Mother of good counsel,", response: "Pray for us." },
      { call: "Mother of our Creator,", response: "Pray for us." },
      { call: "Mother of our Savior,", response: "Pray for us." },
      { call: "Virgin most prudent,", response: "Pray for us." },
      { call: "Virgin most venerable,", response: "Pray for us." },
      { call: "Virgin most renowned,", response: "Pray for us." },
      { call: "Virgin most powerful,", response: "Pray for us." },
      { call: "Virgin most merciful,", response: "Pray for us." },
      { call: "Virgin most faithful,", response: "Pray for us." },
      { call: "Mirror of justice,", response: "Pray for us." },
      { call: "Seat of wisdom,", response: "Pray for us." },
      { call: "Cause of our joy,", response: "Pray for us." },
      { call: "Spiritual vessel,", response: "Pray for us." },
      { call: "Vessel of honor,", response: "Pray for us." },
      { call: "Singular vessel of devotion,", response: "Pray for us." },
      { call: "Mystical rose,", response: "Pray for us." },
      { call: "Tower of David,", response: "Pray for us." },
      { call: "Tower of ivory,", response: "Pray for us." },
      { call: "House of gold,", response: "Pray for us." },
      { call: "Ark of the covenant,", response: "Pray for us." },
      { call: "Gate of heaven,", response: "Pray for us." },
      { call: "Morning star,", response: "Pray for us." },
      { call: "Health of the sick,", response: "Pray for us." },
      { call: "Refuge of sinners,", response: "Pray for us." },
      { call: "Comfort of migrants,", response: "Pray for us." },
      { call: "Comforter of the afflicted,", response: "Pray for us." },
      { call: "Help of Christians,", response: "Pray for us." },
      { call: "Queen of Angels,", response: "Pray for us." },
      { call: "Queen of Patriarchs,", response: "Pray for us." },
      { call: "Queen of Prophets,", response: "Pray for us." },
      { call: "Queen of Apostles,", response: "Pray for us." },
      { call: "Queen of Martyrs,", response: "Pray for us." },
      { call: "Queen of Confessors,", response: "Pray for us." },
      { call: "Queen of Virgins,", response: "Pray for us." },
      { call: "Queen of all Saints,", response: "Pray for us." },
      { call: "Queen conceived without original sin,", response: "Pray for us." },
      { call: "Queen assumed into heaven,", response: "Pray for us." },
      { call: "Queen of the most holy Rosary,", response: "Pray for us." },
      { call: "Queen of families,", response: "Pray for us." },
      { call: "Queen of peace,", response: "Pray for us." }
    ]
  },
  {
    id: "divine-mercy",
    title: "The Chaplet of Divine Mercy",
    category: "devotion",
    subtitle: "Given by Jesus to Saint Faustina Kowalska",
    description: "Prayed on ordinary rosary beads, especially at the 3:00 PM Hour of Great Mercy.",
    content: `Opening Prayers:
You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.

(Repeat three times)
O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You!

Pray 1 Our Father, 1 Hail Mary, and The Apostles' Creed.

On the Large Bead before each decade:
Eternal Father, I offer you the Body and Blood, Soul and Divinity of Your Dearly Beloved Son, Our Lord, Jesus Christ, in atonement for our sins and those of the whole world.

On the 10 Small Beads of each decade:
For the sake of His sorrowful Passion, have mercy on us and on the whole world.

Concluding Doxology (Repeat three times):
Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.

Closing Prayer:
Eternal God, in whom mercy is endless and the treasury of compassion — inexhaustible, look kindly upon us and increase Your mercy in us, that in difficult moments we might not despair nor become despondent, but with great confidence submit ourselves to Your holy will, which is Love and Mercy itself. Amen.`
  },
  {
    id: "angelus",
    title: "The Angelus",
    category: "devotion",
    subtitle: "Commemoration of the Incarnation (6:00 AM, 12:00 PM, 6:00 PM)",
    verses: [
      { call: "The Angel of the Lord declared unto Mary.", response: "And she conceived of the Holy Spirit. (Hail Mary...)" },
      { call: "Behold the handmaid of the Lord.", response: "Be it done unto me according to Your Word. (Hail Mary...)" },
      { call: "And the Word was made flesh.", response: "And dwelt among us. (Hail Mary...)" },
      { call: "Pray for us, O Holy Mother of God.", response: "That we may be made worthy of the promises of Christ." }
    ],
    content: `Let us pray:
Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the incarnation of Christ, Thy Son, was made known by the message of an angel, may by His passion and cross be brought to the glory of His resurrection, through the same Christ our Lord. Amen.`
  },
  {
    id: "st-michael",
    title: "Prayer to Saint Michael the Archangel",
    category: "devotion",
    subtitle: "Prayer for spiritual protection",
    content: `Saint Michael the Archangel, defend us in battle.
Be our protection against the wickedness and snares of the devil;
May God rebuke him, we humbly pray;
And do thou, O Prince of the Heavenly Host, by the power of God,
cast into hell Satan and all the evil spirits
who prowl through the world seeking the ruin of souls.
Amen.`
  },
  {
    id: "anima-christi",
    title: "Anima Christi (Soul of Christ)",
    category: "devotion",
    subtitle: "Post-Communion thanksgiving prayer",
    content: `Soul of Christ, sanctify me.
Body of Christ, save me.
Blood of Christ, inebriate me.
Water from the side of Christ, wash me.
Passion of Christ, strengthen me.
O good Jesus, hear me.
Within Thy wounds hide me.
Suffer me not to be separated from Thee.
From the malicious enemy defend me.
In the hour of my death call me,
and bid me come unto Thee,
that with Thy saints I may praise Thee
for all eternity.
Amen.`
  },
  {
    id: "memorare",
    title: "The Memorare",
    category: "devotion",
    subtitle: "Attributed to Saint Bernard of Clairvaux",
    content: `Remember, O most gracious Virgin Mary,
that never was it known that anyone who fled to thy protection,
implored thy help, or sought thine intercession was left unaided.
Inspired by this confidence, I fly unto thee,
O Virgin of virgins, my mother;
to thee do I come, before thee I stand, sinful and sorrowful.
O Mother of the Word Incarnate,
despise not my petitions,
but in thy mercy hear and answer me.
Amen.`
  },
  {
    id: "act-of-contrition",
    title: "Act of Contrition",
    category: "devotion",
    subtitle: "Sacrament of Reconciliation / Night Prayer",
    content: `O my God, I am heartily sorry for having offended Thee,
and I detest all my sins because of Thy just punishments,
but most of all because they offend Thee, my God,
who art all-good and deserving of all my love.
I firmly resolve, with the help of Thy grace,
to sin no more and to avoid the near occasion of sin.
Amen.`
  }
];
