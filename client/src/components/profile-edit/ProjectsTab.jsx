import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

function ProjectsTab({ profileData }) {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    image_file: null,
    github_link: "",
    demo_link: "",
  });
  const [editingProjects, setEditingProjects] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (profileData && profileData.Projects) {
      setProjects(profileData.Projects);

      const initialEditState = {};
      profileData.Projects.forEach((project) => {
        initialEditState[project.id] = {
          title: project.title,
          description: project.description,
          github_link: project.github_link || "",
          demo_link: project.demo_link || "",
          image_file: null,
        };
      });
      setEditingProjects(initialEditState);
    }
  }, [profileData]);

  const handleProjectFieldChange = (projectId, field, value) => {
    setEditingProjects((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }));
  };

  const handleProjectImageChange = (projectId, e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingProjects((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          image_file: file,
        },
      }));
    }
  };

  const saveProjectChanges = async (projectId) => {
    setError("");

    try {
      const projectData = editingProjects[projectId];

      if (projectData.image_file) {
        const formData = new FormData();

        formData.append("title", projectData.title);
        formData.append("description", projectData.description);
        formData.append("image", projectData.image_file);
        formData.append("github_link", projectData.github_link);
        formData.append("demo_link", projectData.demo_link);

        const response = await axiosInstance.put(
          `/projects/${projectId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setProjects(
          projects.map((project) =>
            project.id === projectId ? response.data : project,
          ),
        );

        setEditingProjects((prev) => ({
          ...prev,
          [projectId]: {
            ...prev[projectId],
            image_file: null,
          },
        }));
      } else {
        const response = await axiosInstance.put(`/projects/${projectId}`, {
          title: projectData.title,
          description: projectData.description,
          github_link: projectData.github_link,
          demo_link: projectData.demo_link,
        });

        setProjects(
          projects.map((project) =>
            project.id === projectId ? response.data : project,
          ),
        );
      }

      setSuccessMessage("Проект успішно оновлено!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating project:", err);
      setError(err.response?.data?.message || "Не вдалося оновити проект.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProject({ ...newProject, image_file: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) return;

    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("title", newProject.title);
      formData.append("description", newProject.description);
      if (newProject.image_file) {
        formData.append("image", newProject.image_file);
      }
      formData.append("github_link", newProject.github_link);
      formData.append("demo_link", newProject.demo_link);
      formData.append("user_id", profileData.id);

      const response = await axiosInstance.post("/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProjects([...projects, response.data]);
      setNewProject({
        title: "",
        description: "",
        image_file: null,
        github_link: "",
        demo_link: "",
      });
      setImagePreview("");
      setSuccessMessage("Проект успішно додано!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding project:", err);
      setError(err.response?.data?.message || "Не вдалося додати проект.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    setError("");
    setSuccessMessage("");

    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
      setSuccessMessage("Проект успішно видалено!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(err.response?.data?.message || "Не вдалося видалити проект.");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Проекти</h2>

      {successMessage && (
        <div className="mb-4 rounded bg-green-700 p-2 text-white">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-700 p-2 text-white">{error}</div>
      )}

      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold">Ваші проекти</h3>
        {projects.length === 0 ? (
          <p className="text-gray-400">Проекти ще не додані.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const editingProject = editingProjects[project.id];

              return (
                <div key={project.id} className="rounded bg-blue-800 p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-medium">{project.title}</h4>
                    <div className="flex space-x-2">
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </div>

                  {editingProject && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Назва проекту
                        </label>
                        <input
                          type="text"
                          className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                          value={editingProject.title}
                          onChange={(e) =>
                            handleProjectFieldChange(
                              project.id,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Назва проекту"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Опис проекту
                        </label>
                        <textarea
                          className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                          rows="3"
                          value={editingProject.description}
                          onChange={(e) =>
                            handleProjectFieldChange(
                              project.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Опис проекту"
                        />
                      </div>
                    </div>
                  )}

                  {project.image_url && !editingProject?.image_file && (
                    <div className="mt-3">
                      <img
                        src={`http://localhost:3001/${project.image_url}`}
                        alt={project.title}
                        className="h-32 w-auto rounded object-cover"
                      />
                    </div>
                  )}

                  {editingProject?.image_file && (
                    <div className="mt-3">
                      <p className="mb-1 text-sm text-blue-300">
                        Нове зображення:
                      </p>
                      <img
                        src={URL.createObjectURL(editingProject.image_file)}
                        alt="Preview"
                        className="h-32 w-auto rounded object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-3 space-y-3 text-sm">
                    <div className="mt-3 flex flex-col">
                      <span className="mb-2 text-sm font-medium">
                        Зображення проекту:
                      </span>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleProjectImageChange(project.id, e)
                        }
                        className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-white hover:file:bg-blue-600"
                        accept="image/*"
                      />
                      <p className="mt-1 text-xs text-blue-300">
                        Максимальний розмір: 5MB
                      </p>
                    </div>

                    <div className="flex items-center">
                      <span className="mr-2 font-medium">GitHub:</span>
                      <input
                        type="text"
                        className="flex-grow rounded border border-blue-700 bg-blue-950 p-1 text-white"
                        value={editingProject?.github_link || ""}
                        onChange={(e) =>
                          handleProjectFieldChange(
                            project.id,
                            "github_link",
                            e.target.value,
                          )
                        }
                        placeholder="URL GitHub репозиторію"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 font-medium">Demo:</span>
                      <input
                        type="text"
                        className="flex-grow rounded border border-blue-700 bg-blue-950 p-1 text-white"
                        value={editingProject?.demo_link || ""}
                        onChange={(e) =>
                          handleProjectFieldChange(
                            project.id,
                            "demo_link",
                            e.target.value,
                          )
                        }
                        placeholder="URL демо-версії"
                      />
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => saveProjectChanges(project.id)}
                        className="focus:shadow-outline rounded bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700 focus:outline-none"
                      >
                        Зберегти проект
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Додати новий проект</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Назва</label>
            <input
              type="text"
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              placeholder="Назва проекту"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Опис</label>
            <textarea
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
              rows="3"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              placeholder="Опишіть ваш проект"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Зображення проекту
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-white hover:file:bg-blue-600"
              onChange={handleImageChange}
            />
            <p className="mt-1 text-xs text-blue-300">
              Максимальний розмір: 5MB
            </p>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto rounded object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">GitHub URL</label>
            <input
              type="text"
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
              value={newProject.github_link}
              onChange={(e) =>
                setNewProject({ ...newProject, github_link: e.target.value })
              }
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Demo URL</label>
            <input
              type="text"
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
              value={newProject.demo_link}
              onChange={(e) =>
                setNewProject({ ...newProject, demo_link: e.target.value })
              }
              placeholder="https://yourproject.com"
            />
          </div>

          <button
            onClick={handleAddProject}
            className="focus:shadow-outline rounded bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700 focus:outline-none"
            disabled={!newProject.title || !newProject.description}
          >
            Додати проект
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsTab;
