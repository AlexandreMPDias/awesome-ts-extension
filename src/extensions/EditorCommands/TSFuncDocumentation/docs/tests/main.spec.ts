
import { } from 'jest';
import CommentGenerator from '../index';

const testCases: Array<[string, string]> = [
	[
		`const hue = (batata:IBatata,yeye:{ hue : string , aux : batata} ,{wi,xu}:{wi:string,xu:string}) : bewtata => {
		yeye ... coisas ?0*$(_!*@!@#95)
	}`, `	/**
	 * Hue
	 *
	 * @param {IBatata} batata
	 * @param {{hue:string,aux:batata}} yeye
	 * @param {{wi:string,xu:string}} {wi,xu}
	 * 
	 * @return {bewtata}
	 */`
	],
	[
		`hue<T> = (batata:IBatata,yeye:{ hue : string , aux : batata} ,{wi,xu}:{wi:string,xu:string}) : bewtata => {
		yeye ... coisas ?0*$(_!*@!@#95)
	}`, `	/**
	 * Hue
	 *
	 * @param {IBatata} batata
	 * @param {{hue:string,aux:batata}} yeye
	 * @param {{wi:string,xu:string}} {wi,xu}
	 * 
	 * @return {bewtata}
	 */`
	],
	[
		`const hue = (foo: () => void,yeye : {hue:string,aux:batata},{wi,xu}:{wi:string,xu:string}) => {yeye ... coisas ?0*$(_!*@!@#95)
		}`, `	/**
		* Hue
		*
		* @param {()=>void} foo
		* @param {{hue:string,aux:batata}} yeye
		* @param {{wi:string,xu:string}} {wi,xu}
		*/`
	],
	[
		`function hue (foo: () => void,yeye : {hue:string,aux:batata},{wi,xu}:{wi:string,xu:string}) {
			yeye ... coisas ?0*$(_!*@!@#95)
		}`, `	/**
		* Hue
		*
		* @param {()=>void} foo
		* @param {{hue:string,aux:batata}} yeye
		* @param {{wi:string,xu:string}} {wi,xu}
		*/`
	],
	[
		`function hue() {
			yeye ... coisas ?0*$(_!*@!@#95)
		}`,
		`	/**
			 * Hue
			 */`
	]
]

function fix (str: string): string[]
{
	return str.split('\n').map(l => l.trim());
}

describe('TSDocumentation', () =>
{
	describe('Extractor', () =>
	{
		testCases.forEach(([input, expectedResult], index) =>
		{
			it(`Case ${index + 1}`, () =>
			{
				const comment = CommentGenerator.commentify(input, 1);
				const commentAsLines = fix(comment);

				const expectedAsLines = fix(expectedResult);

				expectedAsLines.forEach((expectedLine, index) =>
				{
					expect(commentAsLines[index]).toBe(expectedLine);
				})
			})
		})
	})
});
