
import { } from 'jest';
import Extractor from '../Extractor';
import { IFieldValues } from '../../types';

const extractor = new Extractor();

const testCases: Array<[string, IFieldValues]> = [
	[
		`const hue = (batata:IBatata,yeye:{ hue : string , aux : batata} ,{wi,xu}:{wi:string,xu:string}) : bewtata => {
		yeye ... coisas ?0*$(_!*@!@#95)
	}`, {
			name: 'hue',
			args: [
				{ name: 'batata', type: 'IBatata' },
				{ name: 'yeye', type: '{hue:string,aux:batata}' },
				{ name: '{wi,xu}', type: '{wi:string,xu:string}' },
			],
			retType: 'bewtata'
		},
	],
	[
		`hue<T> = (batata:IBatata,yeye:{ hue : string , aux : batata} ,{wi,xu}:{wi:string,xu:string}) : bewtata => {
		yeye ... coisas ?0*$(_!*@!@#95)
	}`, {
			name: 'hue',
			args: [
				{ name: 'batata', type: 'IBatata' },
				{ name: 'yeye', type: '{hue:string,aux:batata}' },
				{ name: '{wi,xu}', type: '{wi:string,xu:string}' },
			],
			retType: 'bewtata'
		},
	],
	[
		`const hue = (foo: () => void,yeye : {hue:string,aux:batata},{wi,xu}:{wi:string,xu:string}) => {yeye ... coisas ?0*$(_!*@!@#95)
		}`, {
			name: 'hue',
			args: [
				{ name: 'foo', type: '()=>void' },
				{ name: 'yeye', type: '{hue:string,aux:batata}' },
				{ name: '{wi,xu}', type: '{wi:string,xu:string}' },
			],
			retType: ''
		},
	],
	[
		`function hue (foo: () => void,yeye : {hue:string,aux:batata},{wi,xu}:{wi:string,xu:string}) {
			yeye ... coisas ?0*$(_!*@!@#95)
		}`, {
			name: 'hue',
			args: [
				{ name: 'foo', type: '()=>void' },
				{ name: 'yeye', type: '{hue:string,aux:batata}' },
				{ name: '{wi,xu}', type: '{wi:string,xu:string}' },
			],
			retType: ''
		},
	],
	[
		`function hue() {
			yeye ... coisas ?0*$(_!*@!@#95)
		}`, {
			name: 'hue',
			args: [],
			retType: ''
		},
	]
]

describe('TSDocumentation', () =>
{
	describe('Extractor', () =>
	{
		testCases.forEach(([input, expectedResult], index) =>
		{
			it(`Case ${index + 1}`, () =>
			{
				const extracted = extractor.generate(input);
				expect(extracted).toEqual(expectedResult);
			})
		})
	})
});
