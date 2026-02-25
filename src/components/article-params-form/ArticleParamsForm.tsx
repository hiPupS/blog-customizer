import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	initialState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	initialState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);

	// Черновик формы
	const [draftState, setDraftState] = useState<ArticleStateType>(initialState);

	const asideRef = useRef<HTMLElement | null>(null);
	const arrowRef = useRef<HTMLDivElement | null>(null);

	// синхронизация черновика при reset снаружи
	useEffect(() => {
		setDraftState(initialState);
	}, [initialState]);

	// закрытие по клику вне
	useEffect(() => {
		if (!isOpen) return;

		const handleOutsideClick = (e: MouseEvent) => {
			const target = e.target as Node;

			const clickedInsideAside =
				asideRef.current !== null && asideRef.current.contains(target);

			const clickedOnArrow =
				arrowRef.current !== null && arrowRef.current.contains(target);

			if (!clickedInsideAside && !clickedOnArrow) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(draftState);
		setIsOpen(false);
	};

	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		setDraftState(initialState);
		onReset();
		setIsOpen(false);
	};

	return (
		<>
			<div ref={arrowRef}>
				<ArrowButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
			</div>

			<aside
				ref={asideRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Select
						title='Шрифт'
						placeholder='Выберите шрифт'
						options={fontFamilyOptions}
						selected={draftState.fontFamilyOption}
						onChange={(selected) =>
							setDraftState((prev) => ({ ...prev, fontFamilyOption: selected }))
						}
					/>

					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={draftState.fontSizeOption}
						onChange={(selected) =>
							setDraftState((prev) => ({ ...prev, fontSizeOption: selected }))
						}
					/>

					<Select
						title='Цвет текста'
						placeholder='Выберите цвет'
						options={fontColors}
						selected={draftState.fontColor}
						onChange={(selected) =>
							setDraftState((prev) => ({ ...prev, fontColor: selected }))
						}
					/>

					<Select
						title='Цвет фона'
						placeholder='Выберите цвет'
						options={backgroundColors}
						selected={draftState.backgroundColor}
						onChange={(selected) =>
							setDraftState((prev) => ({ ...prev, backgroundColor: selected }))
						}
					/>

					<RadioGroup
						name='contentWidth'
						title='Ширина контента'
						options={contentWidthArr}
						selected={draftState.contentWidth}
						onChange={(selected) =>
							setDraftState((prev) => ({ ...prev, contentWidth: selected }))
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
