const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      message: "Se quiere verificar el role sin validar el token primero.",
    });
  }

  const { rol, name } = req.user;

  if (rol !== "ADMIN_ROLE") {
    return res
      .status(401)
      .json({ message: "No tiene permisos para realizar esta accion" });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        message: "Se quiere verificar el role sin validar el token primero.",
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res
        .status(401)
        .json({ message: `El servicio require uno de estos roles ${roles}`});
    }
    next();
  };
};

module.exports = { isAdminRole, hasRole };
