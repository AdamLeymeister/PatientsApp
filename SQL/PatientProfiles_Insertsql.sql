USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[HorseProfiles_Insert]    Script Date: 11/9/2022 3:10:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Adam Leymeister>
-- Create date: <9/23/2022>
-- Description: <Horse Profiles Insert>
-- Code Reviewer:
-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================
ALTER PROC [dbo].[HorseProfiles_Insert] @Name NVARCHAR(100)
	,@Age NUMERIC(2, 1)
	,@BreedTypeId INT
	,@IsFemale BIT
	,@Color NVARCHAR(50)
	,@Weight DECIMAL(4, 3)
	,@PrimaryImageUrl NVARCHAR(255)
	,@HasConsent BIT
	,@CreatedBy INT
	,@LocationId INT
	,@Files dbo.IdTable READONLY
	,@Medications dbo.HorseMedicationsTable READONLY
	,@Users dbo.IdTable READONLY
	,@Id INT OUTPUT
	/*
 Declare @Name nvarchar(100) = 'testGeo9',
		@Age numeric(2,1) = 1.123,
		@BreedTypeId int = 2,
		@IsFemale bit = 0,
		@Color nvarchar(50)= 'testColor',
		@Weight decimal(4,3) = 1.1234,
		@PrimaryImageUrl nvarchar(255) = 'test.jpg',
		@HasConsent Bit = 0,
		@LocationId int = 248, 
		@CreatedBy int = 77
		,@Medications dbo.HorseMedicationsTable
		,@Files dbo.IdTable
		,@Users dbo.IdTable
		,@Id int = 248


	Execute dbo.HorseProfiles_Insert @Name
									 ,@Age
									 ,@BreedTypeId
									 ,@IsFemale
									 ,@Color
									 ,@Weight
									 ,@PrimaryImageUrl
									 ,@HasConsent
									 ,@CreatedBy
									 ,@LocationId
									,@Files
									,@Medications
									,@Users
									,@Id OUTPUT
*/
AS
BEGIN
	DECLARE @DateTime DATETIME2 = GETUTCDATE()

	INSERT INTO dbo.HorseProfiles (
		Name
		,Age
		,BreedTypeId
		,IsFemale
		,Color
		,Weight
		,PrimaryImageUrl
		,HasConsent
		,LocationId
		,CreatedBy
		,DateCreated
		,DateModified
		)
	VALUES (
		@Name
		,@Age
		,@BreedTypeId
		,@IsFemale
		,@Color
		,@Weight
		,@PrimaryImageUrl
		,@HasConsent
		,@LocationId
		,@CreatedBy
		,@DateTime
		,@DateTime
		)

	SET @Id = SCOPE_IDENTITY()

	INSERT INTO dbo.HorseFiles (
		HorseProfileId
		,FileId
		)
	SELECT @Id
		,f.Id
	FROM @Files AS f
	WHERE NOT EXISTS (
			SELECT 1
			FROM dbo.HorseFiles AS hf
			WHERE hf.HorseProfileId = @Id
				AND hf.FileId = f.Id
			)

	INSERT INTO dbo.HorseMedications (
		HorseProfileId
		,MedicationId
		,Dosage
		,DosageUnit
		,NumberDoses
		,StartDate
		,Frequency
		)
	SELECT @Id
		,m.Id
		,m.Dosage
		,m.DosageUnit
		,m.NumberDoses
		,m.StartDate
		,m.Frequency
	FROM @Medications AS m
	WHERE NOT EXISTS (
			SELECT 1
			FROM dbo.HorseMedications AS hm
			WHERE hm.HorseProfileId = @Id
				AND hm.MedicationId = m.Id
			)

	INSERT INTO dbo.UserHorses (
		HorseProfileId
		,UserId
		)
	SELECT @Id
		,u.Id
	FROM @Users AS u
	WHERE NOT EXISTS (
			SELECT 1
			FROM dbo.UserHorses AS uh
			WHERE uh.HorseProfileId = @Id
				AND uh.UserId = u.Id
			)
END
