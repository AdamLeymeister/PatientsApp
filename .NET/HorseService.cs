/*using Newtonsoft.Json;
using Data;
using Data.Providers;
using Models;
using Models.Domain;
using Models.Domain.File;
using Models.Domain.HorseProfiles;
using Models.Domain.Locations;
using Models.Domain.Medications;
using Models.Domain.Users;
using Models.Requests.File;
using Models.Requests.HorseProfiles;
using Services.Interfaces;
using Services.Interfaces.HorseProfiles;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;*/


namespace Services.HorseProfiles;

public class HorseService : IHorseService
{
    private static IDataProvider _data = null;
    private static ILookUpService _lookUpService = null;
    private static ILocationService _locationService = null;
    private static IUserService _userService = null;

    public HorseService(IDataProvider data, ILookUpService lookup, ILocationService locationService, IUserService userService)
    {
        _data = data;
        _locationService = locationService;
        _lookUpService = lookup;
        _userService = userService;
    }

    public Paged<HorseProfile> GetAll(int pageIndex, int pageSize)
    {
        Paged<HorseProfile> paged = null;
        List<HorseProfile> list = null;
        int totalCount = 0;
        _data.ExecuteCmd(
            "HorseProfiles_SelectAll",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                HorseProfile singleItem = MapHorseProfile(reader, ref totalCount);
                if (list == null)
                {
                    list = new List<HorseProfile>();
                }
                list.Add(singleItem);
            }
        );
        if (list != null)
        {
            paged = new Paged<HorseProfile>(list, pageIndex, pageSize, totalCount);
        }
        return paged;
    }
    public Paged<HorseProfile> Search(string query, int pageIndex, int pageSize)
    {
        Paged<HorseProfile> paged = null;
        List<HorseProfile> list = null;
        int totalCount = 0;
        _data.ExecuteCmd(
            "HorseProfiles_Search",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@Query", query);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                HorseProfile singleItem = MapHorseProfile(reader, ref totalCount);
                if (list == null)
                {
                    list = new List<HorseProfile>();
                }
                list.Add(singleItem);
            }
        );
        if (list != null)
        {
            paged = new Paged<HorseProfile>(list, pageIndex, pageSize, totalCount);
        }
        return paged;
    }
    public Paged<HorseProfile> SearchByCreatedBy(int userId, int pageIndex, int pageSize)
    {
        Paged<HorseProfile> paged = null;
        List<HorseProfile> list = null;
        int totalCount = 0;
        _data.ExecuteCmd(
            "HorseProfiles_SelectByCreatedBy",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@CreatedBy", userId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                HorseProfile singleItem = MapHorseProfile(reader, ref totalCount);
                if (list == null)
                {
                    list = new List<HorseProfile>();
                }
                list.Add(singleItem);
            }
        );
        if (list != null)
        {
            paged = new Paged<HorseProfile>(list, pageIndex, pageSize, totalCount);
        }
        return paged;
    }
    public HorseProfile GetById(int id)
    {
        HorseProfile singleItem = null;
        int totalCount = 1;
        _data.ExecuteCmd(
            "HorseProfiles_SelectById",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                singleItem = MapHorseProfile(reader, ref totalCount);
            }
            );
        return singleItem;
    }
    public int Create(HorseAddRequest model, int userId)
    {
        int id = 0;
        _data.ExecuteNonQuery(
            "HorseProfiles_Insert",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                AddCommonParams(model, paramCollection, userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                paramCollection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection param)
            {
                int.TryParse(param["@Id"].Value.ToString(), out id);
            });
        return id;
    }
    public void Update(HorseUpdateRequest model, int userId)
    {
        _data.ExecuteNonQuery(
            "HorseProfiles_Update",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", model.Id);
                AddCommonParams(model, paramCollection, userId);
            },
            returnParameters: null);
    }
    public void Delete(int id)
    {
        _data.ExecuteNonQuery(
            "HorseProfiles_Delete_ById",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            returnParameters: null);
    }
    
    public void VetRemove(int id)
    {
        _data.ExecuteNonQuery(
            "HorseProfiles_Vet_Delete_ById",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            },
            returnParameters: null);
    }
    
    public Paged<HorseProfile> SearchVetPatients(int userId, int pageIndex, int pageSize)
    {
        Paged<HorseProfile> paged = null;
        List<HorseProfile> list = null;
        int totalCount = 0;
        _data.ExecuteCmd(
            "Patients_Select_ByGeo",
            inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@UserId", userId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                HorseProfile singleItem = MapVetPatientProfile(reader, ref totalCount);
                if (list == null)
                {
                    list = new List<HorseProfile>();
                }
                list.Add(singleItem);
            }
        );
        if (list != null)
        {
            paged = new Paged<HorseProfile>(list, pageIndex, pageSize, totalCount);
        }
        return paged;
    }

    //!-----------------------MAPPERS--------------------------------
    private static HorseProfile MapHorseProfile(IDataReader reader, ref int totalCount)
    {
        HorseProfile horse = new HorseProfile();
        List<User> user = new List<User>();
        List<FileModel> file = new List<FileModel>();
        List<Medication> medication = new List<Medication>();

        int startingIndex = 0;
        horse.Id = reader.GetSafeInt32(startingIndex++);
        horse.Name = reader.GetSafeString(startingIndex++);
        horse.Age = reader.GetSafeDecimal(startingIndex++);
        horse.IsFemale = reader.GetSafeBool(startingIndex++);
        horse.Color = reader.GetSafeString(startingIndex++);
        horse.Weight = reader.GetSafeDecimal(startingIndex++);
        horse.PrimaryImageUrl = reader.GetSafeString(startingIndex++);
        horse.HasConsent = reader.GetSafeBool(startingIndex++);
        horse.DateModified = reader.GetSafeDateTime(startingIndex++);
        
        horse.BreedTypeId = _lookUpService.MapSingleLookUp(reader, ref startingIndex);

        horse.HorseLocation = _locationService.MapSingleLocation(reader, ref startingIndex);
        
        horse.OwnerInfo = _userService.MapSingleUser(reader, ref startingIndex);
        
        string userHorses = reader.GetSafeString(startingIndex++);
        string horseMedications = reader.GetSafeString(startingIndex++);
        string horseFiles = reader.GetSafeString(startingIndex++);


        if (!string.IsNullOrEmpty(userHorses)) 
        {
            user = JsonConvert.DeserializeObject<List<User>>(userHorses);
        }
        horse.UserHorses = user;
        if (!string.IsNullOrEmpty(horseMedications))
        {
           medication = JsonConvert.DeserializeObject<List<Medication>>(horseMedications);
        }
        horse.HorseMedications = medication;
        if (!string.IsNullOrEmpty(horseFiles))
        {
            file = JsonConvert.DeserializeObject<List<FileModel>>(horseFiles);
        }
        horse.HorseFiles = file;

        if (totalCount == 0)
        {
            totalCount = reader.GetSafeInt32(startingIndex++);
        }

        return horse;
    }
    private static void AddCommonParams(HorseAddRequest model, SqlParameterCollection paramCollection, int userId)
    {
        DataTable dtFiles = null;
        DataTable dtUsers = null;
        DataTable dtMedications = null;

        if(model.HorseFiles != null)
        {
            dtFiles = MapIdsTable(model.HorseFiles);
        }
        if(model.HorseMedications != null)
        {
            dtMedications = MapHorseMedicationsTable(model.HorseMedications);
        }
        if(model.HorseUsers != null)
        {
            dtUsers = MapIdsTable(model.HorseUsers);
        }
        
        paramCollection.AddWithValue("@Name", model.Name);
        paramCollection.AddWithValue("@Age", model.Age);
        paramCollection.AddWithValue("@IsFemale", model.IsFemale);
        paramCollection.AddWithValue("@Color", model.Color);
        paramCollection.AddWithValue("@CreatedBy", userId);
        paramCollection.AddWithValue("@Weight", model.Weight);
        paramCollection.AddWithValue("@PrimaryImageUrl", model.PrimaryImageUrl);
        paramCollection.AddWithValue("@HasConsent", model.HasConsent);
        paramCollection.AddWithValue("@BreedTypeId", model.BreedTypeId);
        paramCollection.AddWithValue("@LocationId", model.HorseLocationId);
        
        if (dtFiles != null)
        {
            paramCollection.AddWithValue("@Files", dtFiles);
        }
        if (dtMedications != null)
        {
            paramCollection.AddWithValue("@Medications", dtMedications);
        }
        if (dtUsers != null)
        {
            paramCollection.AddWithValue("@Users", dtUsers);
        }
    }

    
    public HorseProfile MapVetPatientProfile(IDataReader reader, ref int totalCount)
    {
        HorseProfile horse = new HorseProfile();
        List<User> user = new List<User>();
        List<FileModel> file = new List<FileModel>();
        List<Medication> medication = new List<Medication>();

        int startingIndex = 0;

        horse.HorseLocation = _locationService.MapSingleLocation(reader, ref startingIndex);

        horse.Name = reader.GetSafeString(startingIndex++);
        horse.Id = reader.GetSafeInt32(startingIndex++);
        horse.Age = reader.GetSafeDecimal(startingIndex++);
        horse.IsFemale = reader.GetSafeBool(startingIndex++);
        horse.Color = reader.GetSafeString(startingIndex++);
        horse.Weight = reader.GetSafeDecimal(startingIndex++);
        horse.PrimaryImageUrl = reader.GetSafeString(startingIndex++);
        horse.HasConsent = reader.GetSafeBool(startingIndex++);

        horse.BreedTypeId = _lookUpService.MapSingleLookUp(reader, ref startingIndex);

        horse.OwnerInfo = _userService.MapSingleUser(reader, ref startingIndex);

        string userHorses = reader.GetSafeString(startingIndex++);
        string horseMedications = reader.GetSafeString(startingIndex++);
        string horseFiles = reader.GetSafeString(startingIndex++);

        if (!string.IsNullOrEmpty(userHorses))
        {
            user = JsonConvert.DeserializeObject<List<User>>(userHorses);
        }
        horse.UserHorses = user;
        if (!string.IsNullOrEmpty(horseMedications))
        {
            medication = JsonConvert.DeserializeObject<List<Medication>>(horseMedications);
        }
        horse.HorseMedications = medication;
        if (!string.IsNullOrEmpty(horseFiles))
        {
            file = JsonConvert.DeserializeObject<List<FileModel>>(horseFiles);
        }
        horse.HorseFiles = file;

        horse.Distance = reader.GetSafeDouble(startingIndex++);

        if (totalCount == 0)
        {
            totalCount = reader.GetSafeInt32(startingIndex++);
        }

        return horse;
    }
    private static DataTable MapIdsTable(int[] idsToMap)
    {
        DataTable dt = new DataTable();
        if (idsToMap != null)
        {
            dt.Columns.Add("Id", typeof(int));

            foreach (var id in idsToMap)
            {
                DataRow dr = dt.NewRow();
                dr.SetField("Id", id);
                dt.Rows.Add(dr);
            }
        }
        return dt;
    }
    private static DataTable MapHorseMedicationsTable(List<Medication> medsToMap)
    {
        DataTable dt = new DataTable();
        if (medsToMap != null)
        {
            dt.Columns.Add("Id", typeof(int));
            dt.Columns.Add("Name", typeof(string));
            dt.Columns.Add("Manufacturer", typeof(string));
            dt.Columns.Add("Dosage", typeof(int));
            dt.Columns.Add("DosageUnit", typeof(string));
            dt.Columns.Add("NumberDoses", typeof(int));
            dt.Columns.Add("Frequency", typeof(string));
            dt.Columns.Add("StartDate", typeof(DateTime));

            foreach (var med in medsToMap)
            {
                DataRow dr = dt.NewRow();
                dr.SetField("Id", med.Id);
                dr.SetField("Name", med.Name);
                dr.SetField("Manufacturer", med.Manufacturer);
                dr.SetField("Dosage", med.Dosage);
                dr.SetField("DosageUnit", med.DosageUnit);
                dr.SetField("NumberDoses", med.NumberDoses);
                dr.SetField("Frequency", med.Frequency);
                dr.SetField("StartDate", med.StartDate);
                dt.Rows.Add(dr);
            }
        }
        return dt;
    }
}