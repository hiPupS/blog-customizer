import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	onApply?: (state: ArticleStateType) => void;
	onReset?: () => void;
	initialState?: ArticleStateType;
};

export const ArticleParamsForm = (props: ArticleParamsFormProps) => {
	const { onApply, onReset, initialState = defaultArticleState } = props;

	const [isOpen, setIsOpen] = useState(false);

	// состояние формы (редактируем тут, но не применяем сразу)
	const [formState, setFormState] = useState<ArticleStateType>(initialState);

	// ✅ фиксируем стартовые значения один раз (как при открытии страницы)
	const initialStateRef = useRef<ArticleStateType>(initialState);

	// если initialState прилетит снаружи — синхронизируем форму,
	// но НЕ перезаписываем initialStateRef (иначе reset станет "сбрасывать" в последнее applied)
	useEffect(() => {
		setFormState(initialState);
	}, [initialState]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply?.(formState);
		setIsOpen(false);
	};

	const handleReset = () => {
		const next = initialStateRef.current;
		setFormState(next);
		onApply?.(next); // по ТЗ: сброс и сразу применить
		onReset?.();
		setIsOpen(false);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />

			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(opt) =>
							setFormState((s) => ({ ...s, fontFamilyOption: opt }))
						}
					/>

					<Separator />

					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(opt) =>
							setFormState((s) => ({ ...s, fontSizeOption: opt }))
						}
					/>

					<Separator />

					<Select
						title='Цвет текста'
						selected={formState.fontColor}
						options={fontColors}
						onChange={(opt) => setFormState((s) => ({ ...s, fontColor: opt }))}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(opt) =>
							setFormState((s) => ({ ...s, backgroundColor: opt }))
						}
					/>

					<Separator />

					<RadioGroup
						title='Ширина контента'
						name='contentWidth'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(opt) =>
							setFormState((s) => ({ ...s, contentWidth: opt }))
						}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
