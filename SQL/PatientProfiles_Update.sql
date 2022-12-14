USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[HorseProfiles_Update]    Script Date: 11/9/2022 3:06:26 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Adam Leymeister>
-- Create date: <9/23/2022>
-- Description: <Horse Profiles Update>
-- Code Reviewer:
-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================
ALTER PROC [dbo].[HorseProfiles_Update] @Id INT
	,@Name NVARCHAR(100)
	,@Age NUMERIC(2, 1)
	,@BreedTypeId INT
	,@IsFemale BIT
	,@Color NVARCHAR(50)
	,@Weight DECIMAL(4, 3)
	,@PrimaryImageUrl NVARCHAR(255)
	,@HasConsent BIT
	,@CreatedBy INT
	,@LocationId INT
	,@Medications dbo.HorseMedicationsTable READONLY
	,@Files IdTable READONLY
	,@Users IdTable READONLY
	/*
 Declare @Name nvarchar(100) = 'testNameUpdated',
		@Age numeric(2,1) = 1.123,
		@BreedTypeId int = 2,
		@IsFemale bit = 0,
		@Color nvarchar(50)= 'testColor',
		@Weight decimal(4,3) = 1.1234,
		@PrimaryImageUrl nvarchar(255) = 'test.jpg',
		@HasConsent Bit = 0,
		@LocationId int = 2, 
		@CreatedBy int = 75

		,@LocationId = 248
		,@Medications dbo.IdTable
		,@Files dbo.IdTable
		,@Users dbo.IdTable
		,@Id int = 134

select * from dbo.HorseProfiles Where Id = @Id
	Execute dbo.HorseProfiles_Update @Id,
									 @Name,
									 @Age,
									 @BreedTypeId,
									 @IsFemale,
									 @Color,
									 @Weight,
									 @PrimaryImageUrl,
									 @HasConsent,
									 @CreatedBy

									,@LocationId
									,@Medications
									,@Files
									,@Users
select * from dbo.HorseProfiles Where Id = @Id

*/
AS
BEGIN
	DECLARE @DateTime DATETIME2 = GETUTCDATE()

	UPDATE dbo.HorseProfiles
	SET Name = @Name
		,Age = @Age
		,BreedTypeId = @BreedTypeId
		,IsFemale = @IsFemale
		,Color = @Color
		,Weight = @Weight
		,PrimaryImageUrl = @PrimaryImageUrl
		,HasConsent = @HasConsent
		,LocationId = @LocationId
		,DateModified = @DateTime
	WHERE Id = @Id

	INSERT INTO dbo.HorseFiles (
		FileId
		,HorseProfileId
		)
	SELECT f.Id
		,@Id
	FROM @Files AS f
	WHERE NOT EXISTS (
			SELECT 1
			FROM dbo.HorseFiles AS hf
			WHERE hf.FileId = f.Id
				AND hf.HorseProfileId = @Id
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
