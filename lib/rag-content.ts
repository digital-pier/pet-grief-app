export interface RagChunk {
  topic: string;
  keywords: string[];
  content: string;
}

export const RAG_CHUNKS: RagChunk[] = [
  {
    topic: "Pet Grief Overview",
    keywords: ["grief", "loss", "bond", "bereavement", "legitimate"],
    content: "Pet loss grief is a clinically recognised and legitimate form of bereavement. The bond between humans and companion animals activates the same neurological and emotional pathways as bonds with human loved ones. The grief is not proportional to the pet's size or lifespan. What determines the depth of grief is the depth of the bond.",
  },
  {
    topic: "Grief Stages",
    keywords: ["stages", "phases", "how long", "timeline", "process", "dual process"],
    content: "Pet loss grief does not follow a linear path. The dual process model describes grieving as an oscillation between loss-orientation (confronting and processing the grief) and restoration-orientation (adapting to life without the pet). There is no correct timeline. Practitioners must never offer timelines to grieving pet owners.",
  },
  {
    topic: "Disenfranchised Grief",
    keywords: ["just a pet", "just a cat", "just a dog", "no one understands", "nobody understands", "dismissed", "overreacting"],
    content: "Disenfranchised grief refers to grief that is not acknowledged, validated, or supported by the social world around the bereaved person. Pet loss is one of the most common forms. Research found that the social response to pet loss is a stronger predictor of grief intensity than the circumstances of the death itself.",
  },
  {
    topic: "Coping Strategies",
    keywords: ["cope", "coping", "what helps", "what can I do", "how do I get through", "help me"],
    content: "Grief is not a problem to be solved. Coping strategies are about supporting the person through it. Talking to someone who validates the loss is consistently the most effective coping tool. Counter-intuitively, actively allowing grief — setting aside time to feel it, cry, look at photos — is healthier than avoidance.",
  },
  {
    topic: "When to Seek Help",
    keywords: ["professional", "therapist", "counselor", "complicated grief", "not functioning", "months later"],
    content: "Complicated grief may be present when the grief remains as intense as the acute phase six months or more after the loss, or the person is unable to function in daily life for an extended period. Professional help is urgently needed when the person expresses thoughts of self-harm or is using alcohol or substances to cope.",
  },
  {
    topic: "Euthanasia Guilt Clinical",
    keywords: ["euthanasia", "put to sleep", "put her down", "put him down", "too soon", "the decision", "the appointment", "betrayed", "the room"],
    content: "Euthanasia guilt is the most common and intense secondary grief experience after pet loss. It is paradoxically most severe in people who made the most compassionate decision, because their love was also the greatest. The guilt is not a sign the wrong decision was made. It is a sign the person loved deeply enough that no decision could have felt entirely right.",
  },
  {
    topic: "Euthanasia Reframe Language",
    keywords: ["right thing", "did I do the right", "act of love", "her comfort", "his comfort", "forgive myself"],
    content: "You could have waited longer — and some part of you wanted to, because saying goodbye was unbearable. But you chose not to ask her to suffer so that you could avoid that pain. That is not betrayal. That is the hardest kind of love. You don't have to feel at peace with this yet. The guilt and the love can coexist for a while.",
  },
  {
    topic: "Anticipatory Grief",
    keywords: ["still alive", "terminal", "diagnosis", "declining", "not much time", "how long does he have", "how long does she have", "going to lose"],
    content: "Anticipatory grief is not a rehearsal for grief. It is grief, happening in real time, in the presence of the living animal. The owner is simultaneously grieving a loss that has not yet happened and trying to be fully present with a pet who is still alive. Grieving someone who is still here does not mean you are giving up on them.",
  },
  {
    topic: "Children and Pet Loss",
    keywords: ["child", "kid", "daughter", "son", "children", "first loss", "first time", "what do I tell", "how do I explain"],
    content: "The death of a pet is frequently a child's first experience of loss and death. Euphemisms such as 'gone to sleep' or 'went away' can create confusion, fear of sleep, or magical thinking about the pet's return. Children's grief may be expressed through play, anger, regression, or asking the same questions repeatedly — but it is real.",
  },
  {
    topic: "Dog Grief",
    keywords: ["dog", "puppy", "lead", "leash", "walk", "back door", "bed", "shadow"],
    content: "Dogs are typically constant physical presences — sleeping in the bedroom, greeting at the door, accompanying on walks. Their loss creates a profound physical absence felt throughout the day in dozens of small moments: the greeting that doesn't happen, the weight that is no longer on the bed, the lead that stays on the hook.",
  },
  {
    topic: "Cat Grief",
    keywords: ["cat", "kitten", "purring", "purr", "lap", "indoor", "just a cat"],
    content: "The phrase 'it was just a cat' is among the most common disenfranchising responses reported by bereaved cat owners. The bond with a cat is typically profound but quieter — felt in the cat's presence in a room, the weight on the lap, the specific sound of purring. Indoor cats create an especially symbiotic daily rhythm whose absence is felt as a total disruption of domestic life.",
  },
  {
    topic: "Horse Grief",
    keywords: ["horse", "stable", "stall", "mare", "gelding", "riding", "barn"],
    content: "Horses require daily physical care, large financial commitment, and deep attunement to the animal's physical and emotional state. This intensive relationship generates bonds of exceptional depth. The loss is experienced in the body as well as the heart — the physical labour of the daily routine ends abruptly. The empty stall, and the smell of the animal that lingers.",
  },
  {
    topic: "Small Animal Grief",
    keywords: ["rabbit", "bird", "parrot", "fish", "hamster", "reptile", "guinea pig", "lizard", "snake", "turtle"],
    content: "Small animal loss is the most disenfranchised category of pet grief. The depth of grief is determined by the depth of the bond, not the size of the animal. A rabbit owned for 10 years, a parrot for 40 years, a guinea pig who was a child's first pet — these are significant relationships that generate real and profound grief.",
  },
  {
    topic: "Grief Language",
    keywords: ["at least", "better place", "get another", "stay busy", "be strong", "move on", "feel better soon"],
    content: "Language that disenfranchises and harms: 'It was just a pet' directly invalidates the grief. 'You can get another one' implies the pet was replaceable. 'At least they had a long life' minimises the loss. 'You'll feel better soon' offers a timeline. All of it communicates that the grief is more than warranted or should be ending.",
  },
  {
    topic: "Human Animal Bond Research",
    keywords: ["research", "science", "proven", "real", "neurochemistry", "oxytocin", "attachment"],
    content: "Research using the same frameworks as human attachment theory has consistently shown that people form genuine attachment bonds with companion animals — bonds characterised by proximity-seeking, separation distress, and secure base effects. Interaction with companion animals activates the oxytocin system in both the human and the animal. This is not sentiment. It is science.",
  },
  {
    topic: "Memorialisation",
    keywords: ["memorial", "tribute", "ashes", "cremation", "photo", "remember", "ceremony", "plant"],
    content: "Memorialisation externalises the relationship — gives it a form that exists in the world rather than only in memory. It creates a place to 'go' with grief, an anchor for remembering. The most meaningful memorials capture the specific personality of the animal — not generic phrases but specific ones. Specificity is love made visible.",
  },
  {
    topic: "Guilt General",
    keywords: ["guilty", "guilt", "blame", "my fault", "should have", "should have noticed", "should have taken"],
    content: "Common forms include caretaking guilt ('I should have taken her to the vet sooner'), presence guilt ('I wasn't there when he died'), and quality of life guilt ('Did I give her the best life?'). Guilt is not evidence of wrongdoing. In grief, guilt is most often evidence of love — a love so thorough that the person searches the entire relationship for places where they could have loved better.",
  },
  {
    topic: "Sife Framework Overview",
    keywords: ["natural", "normal", "not crazy", "too much", "overreacting", "disproportionate"],
    content: "Pet loss grief is not a disorder. It is not a sign of weakness, instability, or disproportionate attachment. It is a natural, necessary, and healthy response to the loss of a deeply loved companion animal. When a person says their pet was their best friend, their child, their reason to get up in the morning — this is not hyperbole and should never be treated as such.",
  },
  {
    topic: "Sife Unique Nature of Pet Love",
    keywords: ["unconditional", "never judged", "always there", "best friend", "closest", "only one who"],
    content: "Pets do not judge their owners. They do not care about weight, status, income, failures, or moods. They are present with the person as they are, always. For many people — especially those who have experienced rejection or conditional love from humans — this unconditional acceptance is profoundly healing. Its loss leaves a specific gap that human relationships cannot easily fill.",
  },
  {
    topic: "Sife Normalising Grief Responses",
    keywords: ["searching", "hearing them", "sensing them", "phantom", "looking for", "called their name", "thought I saw"],
    content: "Searching behaviours: looking for the pet in their usual spots, calling their name, reaching for them out of habit. This is the brain's attachment system continuing to seek the lost bond. It is not delusion. It is love in the process of learning a new reality. Sensory experiences — hearing footsteps, feeling them jump onto the bed — are common and not alarming.",
  },
  {
    topic: "Wolfelt Companioning",
    keywords: ["fix", "move on", "get over it", "when will", "how long until", "will I ever"],
    content: "Companioning grief means being with the person in their pain — not directing them out of it. The companion does not lead and does not set a destination. In practice, companioning means: asking rather than telling, following rather than leading, sitting with silence rather than filling it, and trusting that the grieving person knows what they need.",
  },
  {
    topic: "Wolfelt Needs of Mourning",
    keywords: ["need", "needs", "what do I need", "ritual", "meaning", "identity", "support"],
    content: "Wolfelt identified six core needs of mourning: acknowledging the reality of the death, moving toward the pain of loss, remembering the pet who died, developing a new self-identity, searching for meaning, and receiving ongoing support. These are not stages to pass through sequentially. They are needs that arise and are met throughout the grief journey, sometimes repeatedly.",
  },
];
