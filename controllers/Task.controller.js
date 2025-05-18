import TaskModel from "../models/Task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const newTask = new TaskModel({
      title,
      description,
      dueDate: dueDate || null, // Acepta dueDate o lo establece como null si no se proporciona
    });
    await newTask.save();

    res.status(200).json({
      status: true,
      message: "Task created successfully.",
      taskData: newTask, // Devuelve los datos de la tarea creada
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getAllTask = async (req, res) => {
  try {
    const { status, dueDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (dueDate) filter.dueDate = dueDate;

    const taskData = await TaskModel.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      status: true,
      taskData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const showTask = async (req, res) => {
  try {
    const { taskid } = req.params;
    const taskData = await TaskModel.findById(taskid).lean().exec();

    if (!taskData) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: true,
      taskData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { title, description, status, dueDate } = req.body;

    // Validar que la tarea exista
    const existingTask = await TaskModel.findById(taskid);
    if (!existingTask) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // Validar transiciones de estado según tus reglas de negocio
    if (existingTask.status === "Completed") {
      return res.status(400).json({
        status: false,
        message: "Completed tasks cannot be modified",
      });
    }

    if (status === "Running" && existingTask.status !== "Pending") {
      return res.status(400).json({
        status: false,
        message: "Only Pending tasks can be marked as Running",
      });
    }

    if (status === "Completed" && existingTask.status !== "Running") {
      return res.status(400).json({
        status: false,
        message: "Only Running tasks can be marked as Completed",
      });
    }

    if (status === "Pending" && existingTask.status !== "Pending") {
      return res.status(400).json({
        status: false,
        message: "Cannot return to Pending status",
      });
    }

    // Actualizar la tarea
    const taskData = await TaskModel.findByIdAndUpdate(
      taskid,
      {
        title,
        description,
        status,
        dueDate: dueDate || existingTask.dueDate, // Mantiene el valor existente si no se proporciona
      },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Task updated successfully.",
      taskData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskid } = req.params;

    // Verificar que la tarea existe y está completada
    const task = await TaskModel.findById(taskid);
    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    if (task.status !== "Completed") {
      return res.status(400).json({
        status: false,
        message: "Only completed tasks can be deleted",
      });
    }

    await TaskModel.findByIdAndDelete(taskid);

    res.status(200).json({
      status: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
