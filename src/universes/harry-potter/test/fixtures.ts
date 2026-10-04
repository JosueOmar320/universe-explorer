import type { CharacterAttributes, CharacterResource } from '../api/types';

const EMPTY_ATTRIBUTES: Omit<CharacterAttributes, 'slug' | 'name'> = {
  house: null,
  species: 'Human',
  gender: null,
  blood_status: null,
  born: null,
  died: null,
  nationality: null,
  patronus: null,
  animagus: null,
  boggart: null,
  marital_status: null,
  eye_color: null,
  hair_color: null,
  skin_color: null,
  height: null,
  weight: null,
  alias_names: [],
  family_members: [],
  jobs: [],
  romances: [],
  titles: [],
  wands: [],
};

export function createCharacter(
  slug: string,
  name: string,
  attributes: Partial<CharacterAttributes> = {},
): CharacterResource {
  return {
    id: `uuid-${slug}`,
    type: 'character',
    attributes: { ...EMPTY_ATTRIBUTES, slug, name, ...attributes },
  };
}

const HOUSES = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];

/** 30 characters (more than one page of 24), unsorted: the API sorts by name. */
export const characters: CharacterResource[] = [
  createCharacter('harry-potter', 'Harry James Potter', {
    house: 'Gryffindor',
    gender: 'Male',
    blood_status: 'Half-blood',
    born: "31 July 1980, Godric's Hollow",
    patronus: 'Stag',
    nationality: 'English',
    eye_color: 'Bright green',
    alias_names: ['The Boy Who Lived', 'The Chosen One'],
    jobs: ['Head of the Auror Office'],
    family_members: Array.from({ length: 10 }, (_, index) => `Relative ${index + 1}`),
    wands: ["11', Holly, phoenix feather"],
  }),
  createCharacter('hermione-granger', 'Hermione Jean Granger', {
    house: 'Gryffindor',
    gender: 'Female',
    blood_status: 'Muggle-born',
    patronus: 'Otter',
  }),
  createCharacter('draco-malfoy', 'Draco Lucius Malfoy', { house: 'Slytherin', gender: 'Male' }),
  createCharacter('luna-lovegood', 'Luna Lovegood', { house: 'Ravenclaw', gender: 'Female' }),
  createCharacter('cedric-diggory', 'Cedric Diggory', { house: 'Hufflepuff', gender: 'Male' }),
  createCharacter('hedwig', 'Hedwig', { species: 'Owl' }),
  ...Array.from({ length: 24 }, (_, index) =>
    createCharacter(
      `student-${index + 1}`,
      `Hogwarts student ${String(index + 1).padStart(2, '0')}`,
      {
        house: HOUSES[index % HOUSES.length] ?? null,
      },
    ),
  ),
];
