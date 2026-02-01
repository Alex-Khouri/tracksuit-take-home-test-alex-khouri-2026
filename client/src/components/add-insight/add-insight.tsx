import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import React, { useState, type ChangeEvent } from 'react';

type AddInsightProps = ModalProps;

interface PostInsightData {
  brand: string;
  text: string;
  createdAt: string;
}

export const AddInsight = (props: AddInsightProps) => {
	const [selectedBrand, setSelectedBrand] = useState<string>('1');
	const [insightText, setInsightText] = useState<string>('');

  const addInsight = async (_event: React.FormEvent<HTMLFormElement>) => {
		const dateString: string = new Date().toISOString();

		const postData: PostInsightData = {
			brand: selectedBrand,
			text: insightText,
			createdAt: dateString
		};

		const response = await fetch(`/api/insights`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`HTTP ERROR\nStatus: ${response.status}\nDetails: ${errorData.message || 'Unknown error'}`);
		}
	};

	const handleBrandChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(event.target.value);
  };

	const handleInsightTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInsightText(event.target.value);
	};

	return (
		<Modal {...props}>
		<h1 className={styles.heading}>Add a new insight</h1>
		<form className={styles.form} onSubmit={addInsight}>
			<label className={styles.field}>
			<select className={styles["field-input"]}
				value={selectedBrand} onChange={handleBrandChange}>
				{BRANDS.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
			</select>
			</label>
			<label className={styles.field}>
			Insight
			<textarea
				className={styles["field-input"]}
				rows={5}
				placeholder="Something insightful..."
				value={insightText}
				onChange={handleInsightTextChange}
			/>
			</label>
			<Button className={styles.submit} type="submit" label="Add insight" />
		</form>
		</Modal>
	);
};