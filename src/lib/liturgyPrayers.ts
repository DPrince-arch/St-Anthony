import { BilingualLine, BilingualSection, Prayer } from './types';

// Small helpers keep the bilingual texts readable.
const priest = (en: string, la: string): BilingualLine => ({ role: 'priest', en, la });
const people = (en: string, la: string): BilingualLine => ({ role: 'people', en, la });
const all = (en: string, la: string): BilingualLine => ({ role: 'all', en, la });
const rubric = (en: string): BilingualLine => ({ role: 'rubric', en });

// ---------------------------------------------------------------------------
// Stations of the Cross
// ---------------------------------------------------------------------------

export const STATIONS_OF_THE_CROSS: Prayer = {
  id: 'stations-of-the-cross',
  title: 'Stations of the Cross',
  category: 'stations',
  subtitle: 'Via Crucis: walking with Christ to Calvary',
  description:
    'Prayed especially on the Fridays of Lent. At each station, genuflect for the versicle, read the meditation and prayer, then pray an Our Father, a Hail Mary and a Glory Be. A verse of the Stabat Mater is sung while moving to the next station.',
  stations: {
    opening: `In the name of the Father, and of the Son, and of the Holy Spirit. Amen. \n 
    CHRIST SPEAKS \nThese 14 steps you are abut to walk, you doont takealone. I am with you, we are truly one. and therefore my way ofthe cross two thousand years ago and your own "way" are also one. Yet there is a difference, my life was incomplete until I crowned it with my death, your 14 steps will not be complete until you crown it with your life.\n
    MAN RESPONDS \nMy Lord Jesus Christ, you walked this road of suffering even to your death. You did this for me. and yet I have so often failed to love of you by my sins. Now I want to love you with all my heart and to turn away from everything that offends you. Pardon me my God. Allow me to follow you on this journey. You went out to die for love of me. give me the courage and the faith to be able to die with love of you whenever the right time comes. I want to live and die always united to you, Amen.\n
    We adore you, O Christ, and we praise you.
    Because by your holy cross you have redeemed the world.\n
    At the Cross her station keeping,\nstood the mournful Mother weeping,\nclose to Jesus to the last.
`,
    versicle: {
      call: 'We adore you, O Christ, and we praise you.',
      response: 'Because by your holy cross you have redeemed the world.'
    },
    stations: [
      {
        number: 1,
        title: 'Jesus Is Condemned to Death',
        scripture: 'John 19: 12 - 16',
        reading:
          'Pilate sought to release him, but the Jews cried out, “if you release this man, you are not Caesar’s friend; everyone who make himself a king sets himself against Caesar.” When Pilate heard these words, he brought Jesus out and said to the Jews “Here is your king!” They cried out away with him, away with him, crucify him!” Pilate said to them, “shall I crucify your king?” The chief priests answered, “We have no king but Caesar!” Then he handed him over to them to be crucified.',
        prayer1:
          'CHRIST SPEAKS: In Pilate’s hands, my friend, I see my father’s will it is true that Pilate is unjust but he is the lawful governor and he has power over me; and so the son of God obeys a son of man if I will bow to Pilate’s rule, because this is my Father’s will can you refuse obedience to those whom I have placed over you?',
        prayer2:
          'MAN RESPONDS: Lord Jesus, obedience cost you your life for me, it costs an act of will – no more and yet, how hard it is for me to bend remove the blinders from my eyes that I may see that it is you whom I obey in all who govern me Lord it is you.',
          stabatMater: 'Through her heart, His sorrow sharing,\nall His bitter anguish bearing,\nnow at length the sword has passed.',
      },
      {
        number: 2,
        title: 'Jesus Carries His Cross',
        scripture: 'John 19:17',
        reading:
          'So they took Jesus, and he went out, bearing his own cross, to the place of a skull, which is called in Hebrew Golgotha.',
        prayer1:
          'CHRIST SPEAKS: This cross this chunk of tree, is what my father chose for me. the crosses you must bear are largely products of your daily life. Your weakness, dissatisfaction, insufficiency. And yet my father, your father chose them too, for you. Receive them from his hands.',
        prayer2:
          'MAN RESPONDS: Lord Jesus, I take my daily cross I welcome the monotony, discomfort of all kinds, my disappointments, tensions, setback, cares, worries, all of them. I accept them remind me often that in carrying my cross, I am carrying yours with you.',
        stabatMater: 'O how sad and sore distressed\nwas that Mother, highly blest,\nof the sole-begotten One.',
      },
      {
        number: 3,
        title: 'Jesus Falls the First Time',
        scripture: 'Isaiah 50:5-7',
        reading:
          'The Lord God has opened my ear, and I was not rebellious, I turned not backward. I gave my back to the smiters, and my cheeks to those who pulled out the beard; I did not hide my face from shame and spitting. For the Lord God helps me; therefore I have not been confounded.',
        prayer1:
          'CHRIST SPEAKS: The God who made the universe and holds it in existence the God who directs the movement of the cosmos, this God is, as man, too weak to bear a piece of timber. That is the will of my father I could not be your model otherwise. If you would be my follower you also must accept without complaint your human limitations.',
        prayer2:
          'MAN RESPONDS: Lord Jesus, how can I refuse? I willingly accept my weakness irritation and my moods, my headaches and fatigues, my difficulties in work and home all my defects of body, mind and soul. These “handicaps” of my humanity are your will for me I accept them gladly after your fall, you picked yourself up now pick me up, Lord.',
        stabatMater: 'Christ above in torment hangs,\nshe beneath beholds the pangs\nof her dying glorious Son.',
      },
      {
        number: 4,
        title: 'Jesus Meets His Mother',
        scripture: 'Luke 2:34-35',
        reading:
          '“Behold, this child is set for the fall and rising of many in Israel and for a sign that is spoken against, and a sword will pierce through your own soul that thoughts out of my hearts may be revealed”',
        prayer1: 'CHRIST SPEAKS: My mother sees me whipped. She sees me kicked and driven like a beast. She sees me disgraced. But she did not utter a word of protest or complaint. She shares my martyrdom.',
        prayer2: 'MAN RESPONDS: Lord Jesus, it is harder to watch the pains of those we love than to bear our own pains. To carry my cross after you I too must stand and watch the suffering s of my dear ones. I must watch the poverty of my people, their tattered clothes, malnutrition, no water, no electricity, and what is more, less hope for the future. And, I must let them watch time too. I do believe for those who love you, all things work together unto good. They must.',
        stabatMater: 'Is there one who would not weep,\nwhelmed in miseries so deep,\nChrist\'s dear Mother to behold?',
      },
      {
        number: 5,
        title: 'Simon of Cyrene Helps Jesus Carry the Cross',
        scripture: 'Mark 15:21',
        reading:
          'And they compelled a passer-by, simon of Cyrene, who was coming in from the country, the father of Alexander, and Rufus, to carry his cross.',
        prayer1:
          'CHRIST SPEAKS: I am physically weak I can no longer bear the cross alone, so, they compel simon to help me and indeed he helps me why not you too? Lift the burden from another back each time you do that, you lift the cross’s awful weight that crushes me',
        prayer2: 'MAN RESPONDS: Lord, make me realise that each time I pick up an object off the floor, assist my colleagues in some small task, each time I lend my hand in anyway. It maters not to whom my name is Simon, and the kindness I extend to them I really give to you',
          stabatMater: 'Can the human heart refrain\nfrom partaking in her pain,\nin that Mother\'s pain untold?',
      },
      {
        number: 6,
        title: 'Veronica Wipes the Face of Jesus',
        scripture: 'Isaiah 53:1-3',
        reading:
          'Who has believed what we have heard? And to whom has the arm of the Lord been revealed? For he grew up before him like a young plant, and like a root out of dry ground; he had no form or comeliness that we should look at him, and no beauty that we should desire him. He was despised and rejected by men; a man of sorrows, and acquainted with grief, and as one from whom men hide their faces he was despised and we esteemed him not.',
        prayer1:
          'CHRIST SPEAKS: Can you be brave enough to wipe my bloody face? “where is your face?” you may ask me. and I will answer; “everywhere: at home whenever eyes fill up with tears at work when tensions rise in the classroom, on playgrounds, in the remote and dirty villages, the court, the hospitals, the jails, wherever suffering exists, my face is there and there I look for you to wipe away my blood and tears.',
        prayer2: 'MAN RESPONDS: Lord, this is hard it needs courage and self sacrifice it is an uncomfortable job but I will not run away from it come and act in me and not in me alone – in all men so that we may reveal not your bloody but your glorious face on earth.',
        stabatMater: 'Bruised, derided, cursed, defiled,\nshe beheld her tender Child\nall with bloody scourges rent.',
      },
      {
        number: 7,
        title: 'Jesus Falls the Second Time',
        scripture: 'Isaiah 53:4-6',
        reading:
          'Surely he has borne our griefs and carried our sorrows; yet we esteemed him stricken, smitten by God, and afflicted. But he was wounded for our transgressions, he was bruised for our iniquities; upon him was the chastisement that made us whole, and with his stripes we are healed. All we, like sheep, have gone astray; we have turned everyone to his own way; and the lord has laid on him the iniquity of us all.',
        prayer1:
          'CHRIST SPEAKS: This seventh step, my child, is one that tests your will from this fall learn to persevere in doing good, never say, I can’t go on. Come to me and I will give you rest trust me and carry on.',
        prayer2: 'MAN RESPONDS: Difficulties remain difficult, Lord! When failure presses heavily on me and I am desolate, discouraged, stretch out your hand to lift me up. Alone, there is nothing I can do. With you, I can do all things, I will.',
          stabatMater: 'For the sins of His own nation,\nsaw Him hang in desolation,\ntill His spirit forth He sent.',
      },
      {
        number: 8,
        title: 'Jesus Consoles the Women of Jerusalem',
        scripture: 'Luke 23:27-31',
        reading:
          'And there followed him a great multitude of people, and of women who bewailed and lamented him. But Jesus turning to them said,  “Daughters of Jerusalem, do not weep for me, but weep for yourselves and for your children. for behold, the days are coming when they will say, ‘Blessed are the barren, and the wombs that never bore, and the breasts that never gave suck’. Then they will begin to say to the mountains, ‘Fall on us’; to the hills cover us’. For if they do this when the wood is green, what will happen when it is dry?"',
        prayer1:
          'CHRIST SPEAKS: How often have I longed to gather my children. into one communion with me! but they refused and now these women weep for me. I mourn for them and their sorrows that will come. My dear child, you can really be more gentle you too can be kind.',
        prayer2: 'MAN RESPONDS: Lord, teach me, help me to learn, when I would snap at those who hurt me with their ridicule those who misunderstand me those whom I think hinder my progress with some misguided helpfulness. Those who intrude upon my privacy those who restrict my freedom and liberty. Then help me curb my tongue may gentleness become my cloak.',
        stabatMater: 'O thou Mother! fount of love!\nTouch my spirit from above,\nmake my heart with thine accord.',
      },
      {
        number: 9,
        title: 'Jesus Falls the Third Time',
        scripture: 'Isaiah 53:8-10',
        reading:
          'By oppression and judgement he was taken away; and as for his generation, who considered that he was cut out of the land of the living, stricken for the transgression of my people? And they made his grace with the wicked and with a rich man in his death, although he had done no violent action and there was no deceit in his mouth. Yet it was the will of the Lord to bruse him; he has put him to grief; when he makes himself an offering for sin he shall see his offspring, he shall prolong his days; the will of the Lord shall prosper in his hand.',
        prayer1:
          'CHRIST SPEAKS: I have fallen down again completely drained of strength my body cannot move and yet my will is mine and so is yours. My child, this one thing is certain, your body may be broken but no force on earth and none in hell can take away your will, your will is yours.',
        prayer2: 'MAN RESPONDS: My Lord, after a moment rest you took off again and staggered on. I can do the same because my will is mine when all my strength is gone and guilt and self-reproach press me to earth and seem to hold me fast, when I am pressed down by the consideration that I am of a fallen race protect me from the sin of judas save me from despair Lord, never let me feel that any sin of mine is greater than your love. No matter what my past has been, I can begin anew.',
        stabatMater: 'Make me feel as thou hast felt;\nmake my soul to glow and melt\nwith the love of Christ my Lord.',
      },
      {
        number: 10,
        title: 'Jesus Is Stripped of His Garments',
        scripture: 'John 19:23-24',
        reading:
          'When the soldiers had crucified Jesus they took his garments and made four parts, one for each soldiers; also his tunic, but the tunic was without seam, woven from top to bottom; so they said to one another, “Let us not tear it, but cast lots for it to see whose it shall be. “This was to fulfil the scripture, “They parted my garments among them, and for my clothing they cast lots”.',
        prayer1:
          'CHRIST SPEAKS: Beholds the poorest king that ever lived before the creatures of my own hand I stand stripped the cross – my deathbed is not even my own possessing nothing  I own all I own my father’s love you too own everything so do not worry about your food, your clothes and your life.',
        prayer2: 'MAN RESPONDS: Lord, strip me of the craving for prestige position, wealth and priviledges. Root out of me all traces of envy of my neighbour who has more than I. release me from the vice of pride, my longing to exalt myself, teach me that there is something called humility may I be poor in spirit Lord.',
        stabatMater: 'Holy Mother! pierce me through,\nin my heart each wound renew\nof my Saviour crucified.',
      },
      {
        number: 11,
        title: 'Jesus Is Nailed to the Cross',
        scripture: 'John 19:18-19',
        reading:
          'There they crucified him, and with him two others, one on either side and Jesus between them. Pilate also wrote a title and put it on the cross; it read, “Jesus of Nazareth, the king of the Jews.”',
        prayer1:
          'CHRIST SPEAKS: My executioners pressed the nail into my hand until it stabbed my flesh. Then a heavy hammer-blow smashed. And pain exploded like a bomb of fire in my brain then they seized my other arm. And my legs and each time agony again exploded all – for you.',
        prayer2:
          'MAN RESPONDS: My God am I worth all this? What can I give you in return? Here and now I accept for the rest of my life whatever sickness, torment, agony that will come to me you suffered to be my redeemer I will suffer to be a co-redeemer of my fellowmen.',
        stabatMater: 'Let me share with thee His pain,\nwho for all my sins was slain,\nwho for me in torments died.',
      },
      {
        number: 12,
        title: 'Jesus Dies on the Cross',
        scripture: 'John 19:28-30',
        reading:
          'That the scriptures might be fulfilled Jesus said: I thirst. A bowl of vinegar stood there; so they put a sponge of vinegar on hyssop and held it to his mouth. When jesus had received the vinegar, he said, “it is finished”, and he bowed his head and gave up his spirit.',
        prayer1:
          'CHRIST SPEAKS: Now, the cross has become a pulpit listen to the good news I proclaim from it:-“Forgive them, father you will be with me in paradise there is your mother, there your son, I thirst, it is complete.',
        prayer2:
          'MAN RESPONDS: Lord Jesus, what can I say or do? I offer you my death. I accept now the time and kind of death in store for me I offer you my death for my own sins and those of all my fellowmen.',
        stabatMater: 'Let me mingle tears with thee,\nmourning Him who mourned for me,\nall the days that I may live.',
      },
      {
        number: 13,
        title: 'Jesus Is Taken Down from the Cross',
        scripture: 'John 19:38-39',
        reading:
          'After this Joseph of Arimathea who was a disciple of Jesus, but secretly, for fear of the Jews, asked pilate that the might take away the body of Jesus, and Pilate gave him leave. So he came and took away his body. Nicodemus also, who had at first come to him by night, came bringing a mixture of myrrh and aloes, about a hundred pounds weight.',
        prayer1:
          'CHRIST SPEAKS: The sacrifices is done. Yes, my mass is complete. But not my mother’s and not yours those you love will part from you and grief will come to you. You too will die one day-a day you do not know. Are you prepared for it?',
        prayer2:
          'MAN RESPONDS: Lord, help me to accept the partings that must come from friends who go away, and most of all my dear ones when you shall call them to eternal life. Help me to get ready so that the D-Day whenever it comes will not be a shock to me.',
        stabatMater: 'By the Cross with thee to stay,\nthere with thee to weep and pray,\nis all I ask of thee to give.',
      },
      {
        number: 14,
        title: 'Jesus Is Laid in the Tomb',
        scripture: 'John 19:40-42',
        reading:
          'They took the Body of Jesus, and bound it in lines clothes with the spices, as is the burial customs of the Jews. Now in the place where he was crucified there was a garden, and in the garden a new tomb where no one had ever been laid, so because of the Jewish day of preparation, as the tomb was close at hand, they laid Jesus there.',
        prayer1:
          'CHRIST SPEAKS: So ends my mortal life but now another life begins for Mary and for Magdalene for Peter and John for you my work as man is done. My work within and through the church must now commence. I look to you. You are my friend you are my apostle.',
        prayer2: 
          'MAN RESPONDS: Lord Jesus, it is hard to be your apostle the demands are great. You have completed your work, what is left is mine, that of my fellowmen that of your church. The teachings you could not impart, let me impart. The sufferings you could not bear, let me bear. The work of love you could not do in you short life on earth. Let me do - all through you for you are all in all.',
          stabatMater: 'While my body here decays,\ntmay my soul thy goodness praise,\nsafe in Paradise with thee. Amen',
      },
    ],
    closing: `CHRIST SPEAKS You remember what I told you at the beginning? When you joined me on the way of my cross. I said:- “My life was incomplete until I crowned it with my death your fourteen steps will not be complete until you crown them with your life” Accept each moment that comes to you with faith and trust. All that happens to you has my mark on it, seek me not in far-away places. I am very close to you, your home, your working place, on the streets, the markets, at the playgrounds these are altars where you offer love and I am there with you I want you to live your life. So now! Take up your cross and follow me.

Pray one Our Father, one Hail Mary and one Glory Be for the intentions of the Holy Father.

LET US PRAY
O GOD, who for the world’s redemption wast pleased to be born, circumcised, rejected by the Jews, betrayed by the kiss of the traitor Judas, bound with chains, led like an innocent lamb to the slaughter and shamefully presented before Annas, Caiphas, Pilate, and Herod accused by false witnesses, beaten with whips and buffeted, insulted, spat upon, crowned with thorns. Smitten with a reed, blindfolded, stripped of thy garments, fastened with nails to the cross, and lifted up on high; reputed among thieves, made to drink of gall and vinegar and wounded by a lance. Oh! By these most sacred sufferings, which unworthy as we are, we thus commemorate, and by thy holy cross and death, deliver us, lord from the pains of hell; deign to lead us where thou didst lead that thief who was crucified by thy side: Thou who with the father and the Holy Spirit, livest and reignest, world without end. Amen

V. Parce Domine,

R. Parce populo tuo ]

    Ne in aeternum   ] 3ce  

    Irascaris nobis      ]         

Pie Jesu Domine
Dona eis requiem
Sempiternam

Then a chorister says: Jube, Domine Benedicere

THE BLESSING
May our Lord Jesus Christ, who was scourged for our sake, who carried his cross, and who was crucified for our sake, bless us in the name of the Father, and of the Son, and of the Holy Spirit Amen.`,
  },
};

// ---------------------------------------------------------------------------
// Order of Mass
// ---------------------------------------------------------------------------

const ORDER_OF_MASS_SECTIONS: BilingualSection[] = [
  {
    title: 'Introductory Rites',
    titleLatin: 'Ritus Initiales',
    lines: [
      rubric('All stand. After the entrance chant, the Priest and the faithful sign themselves.'),
      priest(
        'In the name of the Father, and of the Son, and of the Holy Spirit.',
        'In nómine Patris, et Fílii, et Spíritus Sancti.',
      ),
      people('Amen.', 'Amen.'),
      priest(
        'The grace of our Lord Jesus Christ, and the love of God, and the communion of the Holy Spirit be with you all.',
        'Grátia Dómini nostri Iesu Christi, et cáritas Dei, et communicátio Sancti Spíritus sit cum ómnibus vobis.',
      ),
      people('And with your spirit.', 'Et cum spíritu tuo.'),
    ],
  },
  {
    title: 'Penitential Act',
    titleLatin: 'Actus Pænitentiális',
    lines: [
      priest(
        'Brethren, let us acknowledge our sins, and so prepare ourselves to celebrate the sacred mysteries.',
        'Fratres, agnoscámus peccáta nostra, ut apti simus ad sacra mystéria celebránda.',
      ),
      rubric('A brief pause for silence. Then all say:'),
      all(
        'I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned, in my thoughts and in my words, in what I have done and in what I have failed to do,',
        'Confíteor Deo omnipoténti et vobis, fratres, quia peccávi nimis cogitatióne, verbo, ópere et omissióne:',
      ),
      rubric('And, striking their breast, they say:'),
      all(
        'through my fault, through my fault, through my most grievous fault;',
        'mea culpa, mea culpa, mea máxima culpa.',
      ),
      all(
        'therefore I ask blessed Mary ever-Virgin, all the Angels and Saints, and you, my brothers and sisters, to pray for me to the Lord our God.',
        'Ideo precor beátam Maríam semper Vírginem, omnes Angelos et Sanctos, et vos, fratres, oráre pro me ad Dóminum Deum nostrum.',
      ),
      priest(
        'May almighty God have mercy on us, forgive us our sins, and bring us to everlasting life.',
        'Misereátur nostri omnípotens Deus et, dimíssis peccátis nostris, perdúcat nos ad vitam ætérnam.',
      ),
      people('Amen.', 'Amen.'),
    ],
  },
  {
    title: 'Lord, Have Mercy',
    titleLatin: 'Kýrie',
    lines: [
      priest('Lord, have mercy.', 'Kýrie, eléison.'),
      people('Lord, have mercy.', 'Kýrie, eléison.'),
      priest('Christ, have mercy.', 'Christe, eléison.'),
      people('Christ, have mercy.', 'Christe, eléison.'),
      priest('Lord, have mercy.', 'Kýrie, eléison.'),
      people('Lord, have mercy.', 'Kýrie, eléison.'),
    ],
  },
  {
    title: 'Gloria',
    titleLatin: 'Glória',
    lines: [
      rubric('Sung or said on Sundays (outside Advent and Lent), solemnities and feasts.'),
      all(
        'Glory to God in the highest, and on earth peace to people of good will.\nWe praise you, we bless you, we adore you, we glorify you, we give you thanks for your great glory, Lord God, heavenly King, O God, almighty Father.\nLord Jesus Christ, Only Begotten Son, Lord God, Lamb of God, Son of the Father, you take away the sins of the world, have mercy on us; you take away the sins of the world, receive our prayer; you are seated at the right hand of the Father, have mercy on us.\nFor you alone are the Holy One, you alone are the Lord, you alone are the Most High, Jesus Christ, with the Holy Spirit, in the glory of God the Father. Amen.',
        'Glória in excélsis Deo et in terra pax homínibus bonæ voluntátis.\nLaudámus te, benedícimus te, adorámus te, glorificámus te, grátias ágimus tibi propter magnam glóriam tuam, Dómine Deus, Rex cæléstis, Deus Pater omnípotens.\nDómine Fili unigénite, Iesu Christe, Dómine Deus, Agnus Dei, Fílius Patris, qui tollis peccáta mundi, miserére nobis; qui tollis peccáta mundi, súscipe deprecatiónem nostram. Qui sedes ad déxteram Patris, miserére nobis.\nQuóniam tu solus Sanctus, tu solus Dóminus, tu solus Altíssimus, Iesu Christe, cum Sancto Spíritu: in glória Dei Patris. Amen.',
      ),
    ],
  },
  {
    title: 'Collect',
    titleLatin: 'Collécta',
    lines: [
      priest('Let us pray.', 'Orémus.'),
      rubric('All pray in silence for a while. The Priest then says the Collect of the day.'),
      people('Amen.', 'Amen.'),
    ],
  },
  {
    title: 'Liturgy of the Word',
    titleLatin: 'Litúrgia Verbi',
    lines: [
      rubric('All sit for the First Reading and the Responsorial Psalm. At the end of the reading:'),
      priest('The word of the Lord.', 'Verbum Dómini.'),
      people('Thanks be to God.', 'Deo grátias.'),
      rubric('On Sundays and solemnities, a Second Reading follows, ending in the same way. All then stand for the Gospel Acclamation (Alleluia).'),
      priest('The Lord be with you.', 'Dóminus vobíscum.'),
      people('And with your spirit.', 'Et cum spíritu tuo.'),
      priest(
        'A reading from the holy Gospel according to N.',
        'Léctio sancti Evangélii secúndum N.',
      ),
      people('Glory to you, O Lord.', 'Glória tibi, Dómine.'),
      rubric('At the end of the Gospel:'),
      priest('The Gospel of the Lord.', 'Verbum Dómini.'),
      people('Praise to you, Lord Jesus Christ.', 'Laus tibi, Christe.'),
      rubric('All sit for the Homily.'),
    ],
  },
  {
    title: 'Profession of Faith',
    titleLatin: 'Symbolum Nicænum',
    lines: [
      rubric('All stand. At the words that refer to the Incarnation, all bow.'),
      all(
        'I believe in one God, the Father almighty, maker of heaven and earth, of all things visible and invisible.\nI believe in one Lord Jesus Christ, the Only Begotten Son of God, born of the Father before all ages. God from God, Light from Light, true God from true God, begotten, not made, consubstantial with the Father; through him all things were made. For us men and for our salvation he came down from heaven,\nand by the Holy Spirit was incarnate of the Virgin Mary, and became man.\nFor our sake he was crucified under Pontius Pilate, he suffered death and was buried, and rose again on the third day in accordance with the Scriptures. He ascended into heaven and is seated at the right hand of the Father. He will come again in glory to judge the living and the dead and his kingdom will have no end.\nI believe in the Holy Spirit, the Lord, the giver of life, who proceeds from the Father and the Son, who with the Father and the Son is adored and glorified, who has spoken through the prophets.\nI believe in one, holy, catholic and apostolic Church. I confess one Baptism for the forgiveness of sins and I look forward to the resurrection of the dead and the life of the world to come. Amen.',
        'Credo in unum Deum, Patrem omnipoténtem, factórem cæli et terræ, visibílium ómnium et invisibílium.\nEt in unum Dóminum Iesum Christum, Fílium Dei Unigénitum, et ex Patre natum ante ómnia sǽcula. Deum de Deo, lumen de lúmine, Deum verum de Deo vero, génitum, non factum, consubstantiálem Patri: per quem ómnia facta sunt. Qui propter nos hómines et propter nostram salútem descéndit de cælis.\nEt incarnátus est de Spíritu Sancto ex María Vírgine, et homo factus est.\nCrucifíxus étiam pro nobis sub Póntio Piláto; passus et sepúltus est, et resurréxit tértia die, secúndum Scriptúras, et ascéndit in cælum, sedet ad déxteram Patris. Et íterum ventúrus est cum glória, iudicáre vivos et mórtuos, cuius regni non erit finis.\nEt in Spíritum Sanctum, Dóminum et vivificántem: qui ex Patre Filióque procédit. Qui cum Patre et Fílio simul adorátur et conglorificátur: qui locútus est per prophétas.\nEt unam, sanctam, cathólicam et apostólicam Ecclésiam. Confíteor unum baptísma in remissiónem peccatórum. Et exspécto resurrectiónem mortuórum, et vitam ventúri sǽculi. Amen.',
      ),
    ],
  },
  {
    title: 'Universal Prayer',
    titleLatin: 'Orátio Universális',
    lines: [
      rubric('After each intention:'),
      priest('Let us pray to the Lord.', 'Orémus Dóminum.'),
      people('Lord, hear our prayer.', 'Te rogámus, audi nos.'),
    ],
  },
  {
    title: 'Preparation of the Gifts',
    titleLatin: 'Præparátio Donórum',
    lines: [
      rubric('All sit. The gifts are brought to the altar.'),
      priest(
        'Blessed are you, Lord God of all creation, for through your goodness we have received the bread we offer you: fruit of the earth and work of human hands, it will become for us the bread of life.',
        'Benedíctus es, Dómine, Deus univérsi, quia de tua largitáte accépimus panem, quem tibi offérimus, fructum terræ et óperis mánuum hóminum: ex quo nobis fiet panis vitæ.',
      ),
      people('Blessed be God for ever.', 'Benedíctus Deus in sǽcula.'),
      priest(
        'Blessed are you, Lord God of all creation, for through your goodness we have received the wine we offer you: fruit of the vine and work of human hands, it will become our spiritual drink.',
        'Benedíctus es, Dómine, Deus univérsi, quia de tua largitáte accépimus vinum, quod tibi offérimus, fructum vitis et óperis mánuum hóminum, ex quo nobis fiet potus spiritális.',
      ),
      people('Blessed be God for ever.', 'Benedíctus Deus in sǽcula.'),
      rubric('All stand.'),
      priest(
        'Pray, brethren, that my sacrifice and yours may be acceptable to God, the almighty Father.',
        'Oráte, fratres: ut meum ac vestrum sacrifícium acceptábile fiat apud Deum Patrem omnipoténtem.',
      ),
      people(
        'May the Lord accept the sacrifice at your hands for the praise and glory of his name, for our good and the good of all his holy Church.',
        'Suscípiat Dóminus sacrifícium de mánibus tuis ad laudem et glóriam nóminis sui, ad utilitátem quoque nostram totiúsque Ecclésiæ suæ sanctæ.',
      ),
      rubric('The Priest says the Prayer over the Offerings.'),
      people('Amen.', 'Amen.'),
    ],
  },
  {
    title: 'Eucharistic Prayer',
    titleLatin: 'Prex Eucharística',
    lines: [
      priest('The Lord be with you.', 'Dóminus vobíscum.'),
      people('And with your spirit.', 'Et cum spíritu tuo.'),
      priest('Lift up your hearts.', 'Sursum corda.'),
      people('We lift them up to the Lord.', 'Habémus ad Dóminum.'),
      priest('Let us give thanks to the Lord our God.', 'Grátias agámus Dómino Deo nostro.'),
      people('It is right and just.', 'Dignum et iustum est.'),
      rubric('The Priest sings or says the Preface. At its end, all sing or say:'),
      all(
        'Holy, Holy, Holy Lord God of hosts.\nHeaven and earth are full of your glory.\nHosanna in the highest.\nBlessed is he who comes in the name of the Lord.\nHosanna in the highest.',
        'Sanctus, Sanctus, Sanctus Dóminus Deus Sábaoth.\nPleni sunt cæli et terra glória tua.\nHosánna in excélsis.\nBenedíctus qui venit in nómine Dómini.\nHosánna in excélsis.',
      ),
      rubric('All kneel. The Priest continues the Eucharistic Prayer. At the Consecration:'),
      priest(
        'Take this, all of you, and eat of it, for this is my Body, which will be given up for you.',
        'Accípite et manducáte ex hoc omnes: hoc est enim Corpus meum, quod pro vobis tradétur.',
      ),
      priest(
        'Take this, all of you, and drink from it, for this is the chalice of my Blood, the Blood of the new and eternal covenant, which will be poured out for you and for many for the forgiveness of sins. Do this in memory of me.',
        'Accípite et bíbite ex eo omnes: hic est enim calix Sánguinis mei novi et ætérni testaménti, qui pro vobis et pro multis effundétur in remissiónem peccatórum. Hoc fácite in meam commemoratiónem.',
      ),
      priest('The mystery of faith.', 'Mystérium fídei.'),
      people(
        'We proclaim your Death, O Lord, and profess your Resurrection until you come again.',
        'Mortem tuam annuntiámus, Dómine, et tuam resurrectiónem confitémur, donec vénias.',
      ),
      rubric('The Eucharistic Prayer concludes with the doxology:'),
      priest(
        'Through him, and with him, and in him, O God, almighty Father, in the unity of the Holy Spirit, all glory and honour is yours, for ever and ever.',
        'Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipoténti, in unitáte Spíritus Sancti, omnis honor et glória per ómnia sǽcula sæculórum.',
      ),
      people('Amen.', 'Amen.'),
    ],
  },
  {
    title: 'The Lord’s Prayer',
    titleLatin: 'Oratio Domínica',
    lines: [
      rubric('All stand.'),
      priest(
        'At the Saviour’s command and formed by divine teaching, we dare to say:',
        'Præcéptis salutáribus móniti, et divína institutióne formáti, audémus dícere:',
      ),
      all(
        'Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.',
        'Pater noster, qui es in cælis, sanctificétur nomen tuum; advéniat regnum tuum; fiat volúntas tua, sicut in cælo, et in terra. Panem nostrum cotidiánum da nobis hódie; et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris; et ne nos indúcas in tentatiónem; sed líbera nos a malo.',
      ),
      priest(
        'Deliver us, Lord, we pray, from every evil, graciously grant peace in our days, that, by the help of your mercy, we may be always free from sin and safe from all distress, as we await the blessed hope and the coming of our Saviour, Jesus Christ.',
        'Líbera nos, quǽsumus, Dómine, ab ómnibus malis, da propítius pacem in diébus nostris, ut, ope misericórdiæ tuæ adiúti, et a peccáto simus semper líberi et ab omni perturbatióne secúri: exspectántes beátam spem et advéntum Salvatóris nostri Iesu Christi.',
      ),
      people(
        'For the kingdom, the power and the glory are yours now and for ever.',
        'Quia tuum est regnum, et potéstas, et glória in sǽcula.',
      ),
    ],
  },
  {
    title: 'Sign of Peace',
    titleLatin: 'Ritus Pacis',
    lines: [
      priest('The peace of the Lord be with you always.', 'Pax Dómini sit semper vobíscum.'),
      people('And with your spirit.', 'Et cum spíritu tuo.'),
      priest('Let us offer each other the sign of peace.', 'Offérte vobis pacem.'),
    ],
  },
  {
    title: 'Lamb of God',
    titleLatin: 'Agnus Dei',
    lines: [
      all(
        'Lamb of God, you take away the sins of the world, have mercy on us.\nLamb of God, you take away the sins of the world, have mercy on us.\nLamb of God, you take away the sins of the world, grant us peace.',
        'Agnus Dei, qui tollis peccáta mundi: miserére nobis.\nAgnus Dei, qui tollis peccáta mundi: miserére nobis.\nAgnus Dei, qui tollis peccáta mundi: dona nobis pacem.',
      ),
    ],
  },
  {
    title: 'Communion',
    titleLatin: 'Commúnio',
    lines: [
      rubric('All kneel.'),
      priest(
        'Behold the Lamb of God, behold him who takes away the sins of the world. Blessed are those called to the supper of the Lamb.',
        'Ecce Agnus Dei, ecce qui tollit peccáta mundi. Beáti qui ad cenam Agni vocáti sunt.',
      ),
      all(
        'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.',
        'Dómine, non sum dignus, ut intres sub tectum meum, sed tantum dic verbo, et sanábitur ánima mea.',
      ),
      rubric('To each communicant:'),
      priest('The Body of Christ.', 'Corpus Christi.'),
      people('Amen.', 'Amen.'),
      rubric('After a period of silence, all stand for the Prayer after Communion.'),
      priest('Let us pray.', 'Orémus.'),
      people('Amen.', 'Amen.'),
    ],
  },
  {
    title: 'Concluding Rites',
    titleLatin: 'Ritus Conclusiónis',
    lines: [
      rubric('Any brief announcements follow.'),
      priest('The Lord be with you.', 'Dóminus vobíscum.'),
      people('And with your spirit.', 'Et cum spíritu tuo.'),
      priest(
        'May almighty God bless you, the Father, and the Son, and the Holy Spirit.',
        'Benedícat vos omnípotens Deus, Pater, et Fílius, et Spíritus Sanctus.',
      ),
      people('Amen.', 'Amen.'),
      priest('Go forth, the Mass is ended.', 'Ite, missa est.'),
      people('Thanks be to God.', 'Deo grátias.'),
    ],
  },
];

export const ORDER_OF_MASS: Prayer = {
  id: 'order-of-mass',
  title: 'Order of Mass',
  category: 'mass',
  subtitle: 'Ordo Missæ: the parts of the Mass and the people’s responses',
  description:
    'Follow along with the Holy Sacrifice of the Mass. ℣. marks the Priest’s words and ℟. the people’s response. Instructions are shown in italics. Use the toggle to switch between English and Latin.',
  bilingual: ORDER_OF_MASS_SECTIONS,
};

// ---------------------------------------------------------------------------
// Benediction of the Blessed Sacrament
// ---------------------------------------------------------------------------

const BENEDICTION_SECTIONS: BilingualSection[] = [
  {
    title: 'O Saving Victim',
    titleLatin: 'O Salutáris Hóstia',
    lines: [
      rubric('Sung as the Blessed Sacrament is exposed on the altar. All kneel.'),
      all(
        'O saving Victim, opening wide\nthe gate of heaven to man below;\nour foes press on from every side;\nthine aid supply, thy strength bestow.\n\nTo thy great name be endless praise,\nimmortal Godhead, One in Three;\nO grant us endless length of days\nin our true native land with thee. Amen.',
        'O salutáris Hóstia,\nquæ cæli pandis óstium:\nbella premunt hostília,\nda robur, fer auxílium.\n\nUni trinóque Dómino\nsit sempitérna glória,\nqui vitam sine término\nnobis donet in pátria. Amen.',
      ),
      rubric('A period of silent adoration, readings or prayers may follow.'),
    ],
  },
  {
    title: 'Down in Adoration Falling',
    titleLatin: 'Tantum Ergo',
    lines: [
      rubric('Sung as the Priest incenses the Blessed Sacrament.'),
      all(
        'Down in adoration falling,\nLo! the sacred Host we hail;\nLo! o’er ancient forms departing,\nnewer rites of grace prevail;\nfaith for all defects supplying,\nwhere the feeble senses fail.\n\nTo the everlasting Father,\nand the Son who reigns on high,\nwith the Holy Ghost proceeding\nforth from each eternally,\nbe salvation, honour, blessing,\nmight and endless majesty. Amen.',
        'Tantum ergo Sacraméntum\nvenerémur cérnui:\net antíquum documéntum\nnovo cedat rítui:\npræstet fides suppleméntum\nsénsuum deféctui.\n\nGenitóri, Genitóque\nlaus et iubilátio,\nsalus, honor, virtus quoque\nsit et benedíctio:\nprocedénti ab utróque\ncompar sit laudátio. Amen.',
      ),
    ],
  },
  {
    title: 'Versicle and Prayer',
    titleLatin: 'Versus et Orátio',
    lines: [
      priest(
        'You have given them bread from heaven. (Alleluia.)',
        'Panem de cælo præstitísti eis. (Allelúia.)',
      ),
      people('Having all sweetness within it. (Alleluia.)', 'Omne delectaméntum in se habéntem. (Allelúia.)'),
      rubric('"Alleluia" is added during the Easter season.'),
      priest(
        'Let us pray. O God, who in this wonderful Sacrament have left us a memorial of your Passion, grant us, we pray, so to revere the sacred mysteries of your Body and Blood that we may always experience in ourselves the fruits of your redemption. Who live and reign for ever and ever.',
        'Orémus. Deus, qui nobis sub Sacraménto mirábili passiónis tuæ memóriam reliquísti: tríbue, quǽsumus, ita nos Córporis et Sánguinis tui sacra mystéria venerári, ut redemptiónis tuæ fructum in nobis iúgiter sentiámus. Qui vivis et regnas in sǽcula sæculórum.',
      ),
      people('Amen.', 'Amen.'),
      rubric('The Priest blesses the people with the Blessed Sacrament in silence. All bow in adoration.'),
    ],
  },
  {
    title: 'The Divine Praises',
    titleLatin: 'Laudes Divínæ',
    lines: [
      rubric('The Priest leads each line and the people repeat it.'),
      all(
        'Blessed be God.\nBlessed be his holy Name.\nBlessed be Jesus Christ, true God and true man.\nBlessed be the Name of Jesus.\nBlessed be his most Sacred Heart.\nBlessed be his most Precious Blood.\nBlessed be Jesus in the most holy Sacrament of the altar.\nBlessed be the Holy Spirit, the Paraclete.\nBlessed be the great Mother of God, Mary most holy.\nBlessed be her holy and Immaculate Conception.\nBlessed be her glorious Assumption.\nBlessed be the name of Mary, Virgin and Mother.\nBlessed be Saint Joseph, her most chaste spouse.\nBlessed be God in his Angels and in his Saints.',
        'Benedíctus Deus.\nBenedíctum Nomen Sanctum eius.\nBenedíctus Iesus Christus, verus Deus et verus homo.\nBenedíctum Nomen Iesu.\nBenedíctum Cor eius sacratíssimum.\nBenedíctus Sanguis eius pretiosíssimus.\nBenedíctus Iesus in sanctíssimo altáris Sacraménto.\nBenedíctus Sanctus Spíritus, Paráclitus.\nBenedícta excélsa Mater Dei, María sanctíssima.\nBenedícta sancta eius et immaculáta Concéptio.\nBenedícta eius gloriósa Assúmptio.\nBenedíctum nomen Maríæ, Vírginis et Matris.\nBenedíctus sanctus Ioseph, eius castíssimus Sponsus.\nBenedíctus Deus in Angelis suis, et in Sanctis suis.',
      ),
    ],
  },
  {
    title: 'Let Us Adore for Ever',
    titleLatin: 'Adorémus in Ætérnum',
    lines: [
      rubric('Sung as the Blessed Sacrament is returned to the tabernacle.'),
      all(
        'Let us adore for ever the most holy Sacrament.',
        'Adorémus in ætérnum sanctíssimum Sacraméntum.',
      ),
      all(
        'O praise the Lord, all ye nations: praise him, all ye people.\nFor his mercy is confirmed upon us: and the truth of the Lord remaineth for ever.\nGlory be to the Father, and to the Son, and to the Holy Spirit.\nAs it was in the beginning, is now, and ever shall be, world without end. Amen.',
        'Laudáte Dóminum, omnes gentes: laudáte eum, omnes pópuli.\nQuóniam confirmáta est super nos misericórdia eius: et véritas Dómini manet in ætérnum.\nGlória Patri, et Fílio, et Spirítui Sancto.\nSicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.',
      ),
      all(
        'Let us adore for ever the most holy Sacrament.',
        'Adorémus in ætérnum sanctíssimum Sacraméntum.',
      ),
    ],
  },
];

export const BENEDICTION: Prayer = {
  id: 'benediction',
  title: 'Benediction of the Blessed Sacrament',
  category: 'benediction',
  subtitle: 'Hymns and prayers of Eucharistic adoration',
  description:
    'Prayed during Exposition and Benediction of the Most Blessed Sacrament. Use the toggle to switch between English and Latin.',
  bilingual: BENEDICTION_SECTIONS,
};
