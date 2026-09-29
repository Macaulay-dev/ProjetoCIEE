IF DB_ID(N'CieeCurriculos') IS NULL CREATE DATABASE CieeCurriculos;
GO
USE CieeCurriculos;
GO
IF OBJECT_ID(N'dbo.Candidatos', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Candidatos (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    NomeCompleto NVARCHAR(200) NOT NULL,
    Email NVARCHAR(254) NOT NULL,
    Telefone NVARCHAR(30) NULL,
    AreaInteresse NVARCHAR(150) NULL,
    ResumoProfissional NVARCHAR(3000) NULL,
    CriadoEm DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO
