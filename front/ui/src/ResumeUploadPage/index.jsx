import React, { useRef, useState } from "react";
import "./styles.css";

export default function ResumeUploadPage() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert("Сначала выберите файл с резюме");
      return;
    }

    console.log("Файл для отправки:", selectedFile);

    // Здесь позже можно будет добавить отправку на backend:
    // const formData = new FormData();
    // formData.append("resume", selectedFile);
    //
    // await fetch("http://localhost:8000/upload-resume", {
    //   method: "POST",
    //   body: formData,
    // });

    alert("Резюме загружено. Здесь позже будет переход к рекомендациям.");
  };

  return (
    <main className="upload-page">
      <section className="upload-page__content">
        <header className="upload-header">
          <h1>Resume Matcher</h1>
          <p>
            Загрузите резюме, чтобы система подобрала наиболее подходящие
            вакансии на основе текста, навыков и опыта кандидата.
          </p>
        </header>

        <section className="upload-card">
          <div className="upload-card__icon">📄</div>

          <h2>Загрузка резюме</h2>

          <p className="upload-card__description">
            Выберите файл с резюме. После загрузки система выполнит анализ
            данных и сформирует список из пяти наиболее подходящих вакансий.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="upload-input"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
          />

          <button className="upload-button" onClick={handleUploadClick}>
            Загрузить резюме
          </button>

          {selectedFile && (
            <div className="selected-file">
              <span>Выбран файл:</span>
              <strong>{selectedFile.name}</strong>
            </div>
          )}

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedFile}
          >
            Подобрать вакансии
          </button>
        </section>

        <section className="info-card">
          <h2>О работе системы</h2>

          <p>
            Здесь позже можно добавить описание проекта: какие данные
            используются, как рассчитывается соответствие резюме и вакансий,
            какие признаки учитываются при ранжировании.
          </p>

          <div className="info-grid">
            <div className="info-item">
              <h3>Семантическое сходство</h3>
              <p>
                Оценивает близость текстового описания резюме и вакансии.
              </p>
            </div>

            <div className="info-item">
              <h3>Совпадение навыков</h3>
              <p>
                Сравнивает навыки кандидата с требованиями вакансии.
              </p>
            </div>

            <div className="info-item">
              <h3>Соответствие опыта</h3>
              <p>
                Учитывает опыт кандидата относительно минимальных требований.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}