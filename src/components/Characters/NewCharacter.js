import React, { useState } from "react";
import axios from "axios";

const NewCharacter = ({ token }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [subspecies, setSubSpecies] = useState('');
    const [charClass, setCharClass] = useState('');
    const [charSubclass, setCharSubclass] = useState('');
    const [alignment, setAlignment] = useState('true-neutral');
    const [background, setBackground] = useState('');
    const [age, setAge] = useState(0);
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [eyes, setEyes] = useState('');
    const [hair, setHair] = useState('');
    const [skin, setSkin] = useState('');
    const [strength, setStrength] = useState(10);
    const [dexterity, setDexterity] = useState(10);
    const [constitution, setConstitution] = useState(10);
    const [intelligence, setIntelligence] = useState(10);
    const [wisdom, setWisdom] = useState(10);
    const [charisma, setCharisma] = useState(10);
    const [armorClass, setArmorClass] = useState(10);
    const [speed, setSpeed] = useState(25);
    const [hitPoints, setHitPoints] = useState(0);
    const [hitDie, setHitDie] = useState('d6');
    const [personalityTraits, setPersonalityTraits] = useState('');
    const [ideals, setIdeals] = useState('');
    const [bonds, setBonds] = useState('');
    const [flaws, setFlaws] = useState('');

    const createNewCharacter = async (event) => {
        event.preventDefault();
        if (name && species && charClass && background) {
            const fields = {
                name,
                species,
                subspecies,
                class: charClass,
                subclass: charSubclass,
                alignment,
                background,
                age,
                height,
                weight,
                eyes,
                hair,
                skin,
                strength,
                dexterity,
                constitution,
                intelligence,
                wisdom,
                charisma,
                proficiencies: {},
                armorClass,
                speed,
                maxHitPoints: hitPoints,
                currentHitPoints: hitPoints,
                totalHitDice: {
                    [hitDie]: 1
                },
                currentHitDice: {
                    [hitDie]: 1
                },
                attacks: {},
                spells: {},
                personalityTraits,
                ideals,
                bonds,
                flaws,
                features: {}
            };

            Object.keys(fields).map(key => (!fields[key]) ? delete fields[key] : null);

            try {
                const response = await axios.post('/api/characters', fields, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response) {
                    setName('');
                    setSpecies('');
                    setSubSpecies('');
                    setCharClass('');
                    setCharSubclass('');
                    setAlignment('');
                    setBackground('');
                    setAge(0);
                    setHeight(0);
                    setWeight(0);
                    setEyes('');
                    setHair('');
                    setSkin('');
                    setStrength(10);
                    setDexterity(10);
                    setConstitution(10);
                    setIntelligence(10);
                    setWisdom(10);
                    setCharisma(10);
                    setArmorClass(10);
                    setSpeed(25);
                    setHitPoints(0);
                    setHitDie('d6');
                    setPersonalityTraits('');
                    setIdeals('');
                    setBonds('');
                    setFlaws('');
                };
            } catch (error) {
                console.error(error);
            };
        };
    };

    return (
        <form autoComplete="off" onSubmit={createNewCharacter}>
            <div className="mb-3">
                <label htmlFor="name-character" className="form-label">Name*</label>
                <input
                    className="form-control"
                    id="name-character"
                    value={name}
                    required
                    onChange={(event) => setName(event.target.value)}>
                </input>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="species-character" className="form-label">Species*</label>
                    <input
                        className="form-control"
                        id="species-character"
                        value={species}
                        required
                        onChange={(event) => setSpecies(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="subspecies-character" className="form-label">Sub-Species</label>
                    <input
                        className="form-control"
                        id="subspecies-character"
                        value={subspecies}
                        onChange={(event) => setSubSpecies(event.target.value)}>
                    </input>
                </div>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="class-character" className="form-label">Class*</label>
                    <input
                        className="form-control"
                        id="class-character"
                        value={charClass}
                        required
                        onChange={(event) => setCharClass(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="subclass-character" className="form-label">Sub-Class</label>
                    <input
                        className="form-control"
                        id="subclass-character"
                        value={charSubclass}
                        onChange={(event) => setCharSubclass(event.target.value)}>
                    </input>
                </div>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="alignment-character" className="form-label">Alignment*</label>
                    <select
                        className="form-select"
                        id="alignment-character"
                        defaultValue={'true-neutral'}
                        onChange={(event) => setAlignment(event.target.value)}>
                        <option value={'lawful-good'}>Lawful Good</option>
                        <option value={'neutral-good'}>Neutral Good</option>
                        <option value={'chaotic-good'}>Chaotic Good</option>
                        <option value={'lawful-neutral'}>Lawful Neutral</option>
                        <option value={'true-neutral'}>True Neutral</option>
                        <option value={'chaotic-neutral'}>Chaotic Neutral</option>
                        <option value={'lawful-evil'}>Lawful Evil</option>
                        <option value={'neutral-evil'}>Neutral Evil</option>
                        <option value={'chaotic-evil'}>Chaotic Evil</option>
                    </select>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="background-character" className="form-label">Background*</label>
                    <input
                        className="form-control"
                        id="subclass-character"
                        value={background}
                        required
                        onChange={(event) => setBackground(event.target.value)}>
                    </input>
                </div>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="age-character" className="form-label">Age</label>
                    <input
                        type="number"
                        className="form-control"
                        id="age-character"
                        value={age}
                        onChange={(event) => setAge(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="height-character" className="form-label">Height (in)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="height-character"
                        value={height}
                        onChange={(event) => setHeight(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="weight-character" className="form-label">Weight (lbs)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="weight-character"
                        value={weight}
                        onChange={(event) => setWeight(event.target.value)}>
                    </input>
                </div>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="eyes-character" className="form-label">Eyes</label>
                    <input
                        className="form-control"
                        id="eyes-character"
                        value={eyes}
                        onChange={(event) => setEyes(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="hair-character" className="form-label">Hair</label>
                    <input
                        className="form-control"
                        id="hair-character"
                        value={hair}
                        onChange={(event) => setHair(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="skin-character" className="form-label">Skin Tone</label>
                    <input
                        className="form-control"
                        id="skin-character"
                        value={skin}
                        onChange={(event) => setSkin(event.target.value)}>
                    </input>
                </div>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="str-character" className="form-label">Strength</label>
                    <input
                        type="number"
                        className="form-control"
                        id="str-character"
                        value={strength}
                        onChange={(event) => setStrength(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="dex-character" className="form-label">Dexterity</label>
                    <input
                        type="number"
                        className="form-control"
                        id="dex-character"
                        value={dexterity}
                        onChange={(event) => setDexterity(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="con-character" className="form-label">Constitution</label>
                    <input
                        type="number"
                        className="form-control"
                        id="con-character"
                        value={constitution}
                        onChange={(event) => setConstitution(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="int-character" className="form-label">Intelligence</label>
                    <input
                        type="number"
                        className="form-control"
                        id="int-character"
                        value={intelligence}
                        onChange={(event) => setIntelligence(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="wis-character" className="form-label">Wisdom</label>
                    <input
                        type="number"
                        className="form-control"
                        id="wis-character"
                        value={wisdom}
                        onChange={(event) => setWisdom(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="cha-character" className="form-label">Charisma</label>
                    <input
                        type="number"
                        className="form-control"
                        id="cha-character"
                        value={charisma}
                        onChange={(event) => setCharisma(event.target.value)}>
                    </input>
                </div>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="ac-character" className="form-label">Armor Class</label>
                    <input
                        type="number"
                        className="form-control"
                        id="ac-character"
                        value={armorClass}
                        onChange={(event) => setArmorClass(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="speed-character" className="form-label">Speed</label>
                    <input
                        type="number"
                        className="form-control"
                        id="speed-character"
                        value={speed}
                        onChange={(event) => setSpeed(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="hp-character" className="form-label">Hit Points</label>
                    <input
                        type="number"
                        className="form-control"
                        id="hp-character"
                        value={hitPoints}
                        onChange={(event) => setHitPoints(event.target.value)}>
                    </input>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="hit-die-select" className="form-label">Hit Die</label>
                <select
                    className="form-select"
                    id="hit-die-select"
                    defaultValue={'d6'}
                    onChange={(event) => setHitDie(event.target.value)}>
                    <option value={'d6'}>d6</option>
                    <option value={'d8'}>d8</option>
                    <option value={'d10'}>d10</option>
                    <option value={'d12'}>d12</option>
                </select>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="personality-character" className="form-label">Personality Traits</label>
                    <textarea
                        className="form-control"
                        id="personality-character"
                        rows="2"
                        value={personalityTraits}
                        onChange={(event) => setPersonalityTraits(event.target.value)}>
                    </textarea>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="ideals-character" className="form-label">Ideals</label>
                    <textarea
                        className="form-control"
                        id="ideals-character"
                        rows="2"
                        value={ideals}
                        onChange={(event) => setIdeals(event.target.value)}>
                    </textarea>
                </div>
            </div>
            <div className="row g-3 align-items-center">
                <div className="mb-3 col-auto">
                    <label htmlFor="bonds-character" className="form-label">Bonds</label>
                    <textarea
                        className="form-control"
                        id="bonds-character"
                        rows="2"
                        value={bonds}
                        onChange={(event) => setBonds(event.target.value)}>
                    </textarea>
                </div>
                <div className="mb-3 col-auto">
                    <label htmlFor="flaws-character" className="form-label">Flaws</label>
                    <textarea
                        className="form-control"
                        id="flaws-character"
                        rows="2"
                        value={flaws}
                        onChange={(event) => setFlaws(event.target.value)}>
                    </textarea>
                </div>
            </div>
            <button className="btn btn-primary" type="submit">Create Character</button>
        </form>
    );
};

export default NewCharacter;